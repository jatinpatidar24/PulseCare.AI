from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..models.schema import AppointmentCreate, AppointmentUpdateStatus, AppointmentResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentResponse)
def create_appointment(
    appt_data: AppointmentCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    cursor = conn.cursor()

    # Verify doctor exists
    cursor.execute("SELECT id, name, specialization FROM doctors WHERE id = ?", (appt_data.doctor_id,))
    doctor = cursor.fetchone()
    if not doctor:
        conn.close()
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Check for slot collision for the same doctor on the same date and time
    cursor.execute('''
    SELECT id FROM appointments
    WHERE doctor_id = ? AND appointment_date = ? AND time_slot = ? AND status != 'Cancelled'
    ''', (appt_data.doctor_id, appt_data.appointment_date, appt_data.time_slot))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="This time slot has already been booked. Please choose another time.")

    cursor.execute('''
    INSERT INTO appointments (
        patient_id, patient_name, doctor_id, doctor_name, doctor_specialty,
        appointment_date, time_slot, consultation_type, symptoms_summary,
        status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?)
    ''', (
        current_user["id"],
        current_user["name"],
        doctor["id"],
        doctor["name"],
        doctor["specialization"],
        appt_data.appointment_date,
        appt_data.time_slot,
        appt_data.consultation_type,
        appt_data.symptoms_summary or "",
        appt_data.notes or ""
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM appointments WHERE id = ?", (new_id,))
    created_row = dict(cursor.fetchone())
    conn.close()

    return AppointmentResponse(**created_row)

@router.get("", response_model=List[AppointmentResponse])
def get_user_appointments(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    if current_user["role"] == "doctor":
        # Check if doctor has matching email or name
        cursor.execute("SELECT id FROM doctors WHERE LOWER(email) = LOWER(?)", (current_user["email"],))
        doc_row = cursor.fetchone()
        if doc_row:
            cursor.execute("SELECT * FROM appointments WHERE doctor_id = ? ORDER BY appointment_date DESC, id DESC", (doc_row["id"],))
        else:
            cursor.execute("SELECT * FROM appointments WHERE LOWER(doctor_name) LIKE LOWER(?) ORDER BY appointment_date DESC, id DESC", (f"%{current_user['name']}%",))
    else:
        cursor.execute("SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC, id DESC", (current_user["id"],))

    rows = cursor.fetchall()
    conn.close()

    return [AppointmentResponse(**dict(r)) for r in rows]

@router.put("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_data: AppointmentUpdateStatus,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
    appt = cursor.fetchone()
    if not appt:
        conn.close()
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Authorize: user must be patient or doctor
    if current_user["role"] != "doctor" and appt["patient_id"] != current_user["id"]:
        conn.close()
        raise HTTPException(status_code=403, detail="Unauthorized to modify this appointment")

    notes_val = status_data.notes if status_data.notes is not None else appt["notes"]
    cursor.execute('''
    UPDATE appointments
    SET status = ?, notes = ?
    WHERE id = ?
    ''', (status_data.status, notes_val, appointment_id))
    conn.commit()

    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appointment_id,))
    updated = dict(cursor.fetchone())
    conn.close()

    return AppointmentResponse(**updated)
