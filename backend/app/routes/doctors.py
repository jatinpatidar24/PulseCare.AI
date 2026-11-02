import json
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from ..database import get_db
from ..models.schema import DoctorResponse

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

def format_doctor(row: dict) -> DoctorResponse:
    doc = dict(row)
    if isinstance(doc.get("available_days"), str):
        try:
            doc["available_days"] = json.loads(doc["available_days"])
        except Exception:
            doc["available_days"] = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    if isinstance(doc.get("available_time_slots"), str):
        try:
            doc["available_time_slots"] = json.loads(doc["available_time_slots"])
        except Exception:
            doc["available_time_slots"] = ["09:00 AM", "11:00 AM", "02:00 PM"]
    return DoctorResponse(**doc)

@router.get("", response_model=List[DoctorResponse])
def get_doctors(
    specialization: Optional[str] = None,
    search: Optional[str] = None,
    min_rating: Optional[float] = None
):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM doctors WHERE 1=1"
    params = []

    if specialization and specialization.lower() != "all":
        query += " AND LOWER(specialization) = LOWER(?)"
        params.append(specialization)

    if min_rating:
        query += " AND rating >= ?"
        params.append(min_rating)

    if search:
        search_pattern = f"%{search}%"
        query += " AND (LOWER(name) LIKE LOWER(?) OR LOWER(hospital) LIKE LOWER(?) OR LOWER(qualification) LIKE LOWER(?) OR LOWER(specialization) LIKE LOWER(?))"
        params.extend([search_pattern, search_pattern, search_pattern, search_pattern])

    query += " ORDER BY rating DESC, experience_years DESC"

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()

    return [format_doctor(row) for row in rows]

@router.get("/specializations", response_model=List[str])
def get_specializations():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT specialization FROM doctors ORDER BY specialization ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r[0] for r in rows]

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor_by_id(doctor_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctors WHERE id = ?", (doctor_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return format_doctor(row)
