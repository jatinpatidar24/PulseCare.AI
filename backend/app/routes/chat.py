import os
import httpx
from typing import List, Optional
from fastapi import APIRouter
from ..ml.model import prediction_engine
from ..database import get_db
from ..models.schema import ChatRequest, ChatResponse, DoctorResponse
from .doctors import format_doctor

router = APIRouter(prefix="/api/chat", tags=["AI Health Assistant Chat"])

def get_doctors_for_specialty(specialty: str) -> List[DoctorResponse]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctors WHERE LOWER(specialization) = LOWER(?) ORDER BY rating DESC LIMIT 2", (specialty,))
    matched_doctors = cursor.fetchall()
    if not matched_doctors:
        cursor.execute("SELECT * FROM doctors WHERE LOWER(specialization) = 'general physician' ORDER BY rating DESC LIMIT 2")
        matched_doctors = cursor.fetchall()
    conn.close()
    return [format_doctor(d) for d in matched_doctors]

@router.post("", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    user_msg = req.message.strip()
    
    # Extract symptoms from current message as well as prior history
    detected_symptoms = set(prediction_engine.extract_symptoms_from_text(user_msg))
    if req.history:
        for past_msg in req.history:
            if past_msg.role == "user":
                detected_symptoms.update(prediction_engine.extract_symptoms_from_text(past_msg.content))

    symptoms_list = sorted(list(detected_symptoms))

    # Check if Gemini API key is provided (via environment or user request parameter)
    gemini_key = req.api_key or os.getenv("GEMINI_API_KEY")

    prediction_result = None
    recommended_doctors = []

    if len(symptoms_list) >= 2:
        pred = prediction_engine.predict(symptoms_list, top_k=2)
        prediction_result = pred.get("primary_prediction")
        recommended_specialty = pred.get("recommended_specialty", "General Physician")
        recommended_doctors = get_doctors_for_specialty(recommended_specialty)

    # 1. If Gemini key is available, call Gemini API for enhanced clinical bedside manner
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            
            system_prompt = (
                "You are an empathetic, intelligent AI medical triage assistant for a healthcare platform. "
                "Help the patient understand their symptoms, advise them gently on general self-care precautions, "
                "and guide them to the right doctor. Do not make definitive pharmaceutical prescriptions. "
                "Always remind the patient to seek professional in-person medical care for emergencies. "
            )
            if prediction_result:
                system_prompt += (
                    f"Our clinical ML model analyzed their symptoms ({', '.join(symptoms_list)}) and suggests a potential match for: "
                    f"{prediction_result['disease']} ({prediction_result['confidence_percentage']}% confidence). "
                    f"Recommended Medical Specialty: {prediction_result['specialization']}. "
                    f"Precautions to mention: {', '.join(prediction_result['precautions'])}."
                )

            contents = []
            if req.history:
                for h in req.history[-6:]:
                    contents.append({
                        "role": "user" if h.role == "user" else "model",
                        "parts": [{"text": h.content}]
                    })
            contents.append({"role": "user", "parts": [{"text": f"Context: {system_prompt}\n\nPatient says: {user_msg}"}]})

            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json={"contents": contents})
                if resp.status_code == 200:
                    data = resp.json()
                    reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return ChatResponse(
                        reply=reply_text,
                        detected_symptoms=symptoms_list,
                        prediction=prediction_result,
                        recommended_doctors=recommended_doctors,
                        requires_more_info=(len(symptoms_list) < 2)
                    )
        except Exception:
            # Gracefully fallback to local response if network or API key error
            pass

    # 2. Local intelligent conversational engine (works 100% offline, zero latency)
    if not symptoms_list:
        lower_msg = user_msg.lower()
        if any(w in lower_msg for w in ["hello", "hi", "hey", "help", "who are you"]):
            reply = (
                "Hello! I am your AI Health Assistant. "
                "You can tell me how you are feeling (for example: *'I have had a high fever, severe headache, and chills'*), "
                "and I will analyze your symptoms, estimate possible conditions using our clinical ML model, "
                "and match you with the right specialist doctor."
            )
        else:
            reply = (
                "I couldn't identify specific medical symptoms from your message. "
                "Could you describe what physical discomfort you are feeling? For example: fever, cough, joint pain, nausea, skin rash, or shortness of breath?"
            )
        return ChatResponse(
            reply=reply,
            detected_symptoms=[],
            prediction=None,
            recommended_doctors=[],
            requires_more_info=True
        )

    if len(symptoms_list) == 1:
        symptom_display = symptoms_list[0].replace("_", " ")
        reply = (
            f"I noted that you are experiencing **{symptom_display}**. "
            "To give you an accurate assessment and suggest the most suitable doctor, "
            "are you also experiencing any of the following?\n"
            "• Fever, chills, or fatigue?\n"
            "• Nausea, vomiting, or stomach discomfort?\n"
            "• Cough, chest tightness, or dizziness?\n\n"
            "Please describe any other signs you've noticed."
        )
        return ChatResponse(
            reply=reply,
            detected_symptoms=symptoms_list,
            prediction=None,
            recommended_doctors=[],
            requires_more_info=True
        )

    # 2+ symptoms: We have an actionable prediction!
    pred_disease = prediction_result["disease"]
    confidence = prediction_result["confidence_percentage"]
    specialty = prediction_result["specialization"]
    precautions_bullets = "\n".join([f"• {p}" for p in prediction_result["precautions"]])

    symptoms_formatted = ", ".join([s.replace("_", " ") for s in symptoms_list])
    reply = (
        f"Based on the symptoms you reported (**{symptoms_formatted}**), "
        f"our clinical ML model indicates a potential match with **{pred_disease}** ({confidence}% statistical match).\n\n"
        f"**Recommended Specialist:** **{specialty}**\n\n"
        f"**Key Precautions & Immediate Steps:**\n{precautions_bullets}\n\n"
        f"I have found top verified {specialty} specialists available for consultation below. "
        f"You can book an in-person or video appointment directly."
    )

    return ChatResponse(
        reply=reply,
        detected_symptoms=symptoms_list,
        prediction=prediction_result,
        recommended_doctors=recommended_doctors,
        requires_more_info=False
    )
