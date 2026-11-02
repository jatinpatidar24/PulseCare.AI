import os
import shutil
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from ..database import get_db
from ..models.schema import MedicalRecordResponse, VitalsCreate, VitalsResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/records", tags=["Medical Records & EHR"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=MedicalRecordResponse)
async def upload_medical_record(
    title: str = Form(...),
    record_type: str = Form("Prescription"),
    doctor_name: Optional[str] = Form(None),
    record_date: Optional[str] = Form(None),
    diagnosis: Optional[str] = Form(None),
    prescribed_medications: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    # Sanitize and generate unique safe filename
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".pdf", ".png", ".jpg", ".jpeg", ".webp"]:
        raise HTTPException(status_code=400, detail="Allowed file types: PDF, PNG, JPG, JPEG, WEBP")

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    file_url = f"/uploads/{unique_filename}"
    date_str = record_date or datetime.now().strftime("%Y-%m-%d")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO medical_records (
        patient_id, title, record_type, doctor_name, record_date,
        file_name, file_path, file_size, mime_type, diagnosis,
        prescribed_medications, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        current_user["id"],
        title,
        record_type,
        doctor_name or "Consulting Physician",
        date_str,
        file.filename,
        file_url,
        file_size,
        file.content_type,
        diagnosis or "",
        prescribed_medications or "",
        notes or ""
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM medical_records WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()

    return MedicalRecordResponse(**row)

@router.get("", response_model=List[MedicalRecordResponse])
def get_medical_records(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM medical_records WHERE patient_id = ? ORDER BY record_date DESC, id DESC", (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()

    return [MedicalRecordResponse(**dict(r)) for r in rows]

@router.delete("/{record_id}")
def delete_medical_record(record_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM medical_records WHERE id = ? AND patient_id = ?", (record_id, current_user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Record not found or unauthorized")

    # Optionally delete physical file
    try:
        raw_name = os.path.basename(row["file_path"])
        disk_path = os.path.join(UPLOAD_DIR, raw_name)
        if os.path.exists(disk_path) and not raw_name.startswith("sample_"):
            os.remove(disk_path)
    except Exception:
        pass

    cursor.execute("DELETE FROM medical_records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()

    return {"message": "Record deleted successfully"}

# Patient Vitals Monitoring endpoints
@router.post("/vitals", response_model=VitalsResponse)
def record_vitals(vitals_data: VitalsCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    date_str = vitals_data.logged_date or datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # Assess status
    status = "Normal"
    if vitals_data.systolic_bp and (vitals_data.systolic_bp > 140 or vitals_data.systolic_bp < 90):
        status = "Attention"
    elif vitals_data.blood_sugar and (vitals_data.blood_sugar > 140 or vitals_data.blood_sugar < 70):
        status = "Attention"
    elif vitals_data.spo2 and vitals_data.spo2 < 95:
        status = "Low SpO2"

    cursor.execute('''
    INSERT INTO vitals_logs (
        patient_id, systolic_bp, diastolic_bp, heart_rate,
        blood_sugar, temperature, spo2, logged_date, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        current_user["id"],
        vitals_data.systolic_bp,
        vitals_data.diastolic_bp,
        vitals_data.heart_rate,
        vitals_data.blood_sugar,
        vitals_data.temperature,
        vitals_data.spo2,
        date_str,
        status,
        vitals_data.notes or ""
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM vitals_logs WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()

    return VitalsResponse(**row)

@router.get("/vitals", response_model=List[VitalsResponse])
def get_vitals_history(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM vitals_logs WHERE patient_id = ? ORDER BY logged_date DESC, id DESC LIMIT 30", (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()

    return [VitalsResponse(**dict(r)) for r in rows]
