import json
from fastapi import APIRouter, HTTPException
from ..ml.model import prediction_engine
from ..ml.dataset import SYMPTOMS_LIST, SYMPTOM_CATEGORIES
from ..database import get_db
from ..models.schema import PredictRequest, PredictResponse, DoctorResponse
from .doctors import format_doctor

router = APIRouter(prefix="/api/predict", tags=["Disease Prediction"])

@router.get("/symptoms")
def get_available_symptoms():
    """Returns available symptoms categorized for UI selection"""
    categorized = {}
    for category, symptoms in SYMPTOM_CATEGORIES.items():
        categorized[category] = [
            {
                "id": s,
                "label": s.replace("_", " ").title()
            }
            for s in symptoms if s in SYMPTOMS_LIST
        ]

    flat_list = [
        {"id": s, "label": s.replace("_", " ").title()}
        for s in sorted(SYMPTOMS_LIST)
    ]

    return {
        "categories": categorized,
        "all_symptoms": flat_list,
        "total_count": len(flat_list)
    }

@router.post("/disease", response_model=PredictResponse)
def predict_disease(req: PredictRequest):
    """Predicts diseases based on symptoms and recommends matching specialist doctors"""
    if not req.symptoms:
        raise HTTPException(status_code=400, detail="Please select at least one symptom.")

    res = prediction_engine.predict(req.symptoms, top_k=req.top_k or 3)
    if "error" in res and not res.get("all_predictions"):
        raise HTTPException(status_code=400, detail=res["error"])

    specialty = res.get("recommended_specialty", "General Physician")

    # Fetch matching doctors for this specialization
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctors WHERE LOWER(specialization) = LOWER(?) ORDER BY rating DESC LIMIT 3", (specialty,))
    matched_doctors = cursor.fetchall()
    
    # Fallback to general physicians if no exact specialist found
    if not matched_doctors:
        cursor.execute("SELECT * FROM doctors WHERE LOWER(specialization) = 'general physician' ORDER BY rating DESC LIMIT 3")
        matched_doctors = cursor.fetchall()

    conn.close()

    formatted_docs = [format_doctor(d) for d in matched_doctors]

    return PredictResponse(
        matched_symptoms=res["matched_symptoms"],
        primary_prediction=res["primary_prediction"],
        all_predictions=res["all_predictions"],
        recommended_specialty=specialty,
        recommended_doctors=formatted_docs
    )
