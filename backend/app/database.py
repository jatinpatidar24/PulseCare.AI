import sqlite3
import os
import json
from datetime import datetime
import bcrypt

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "healthcare.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'patient', -- 'patient' or 'doctor'
        phone TEXT,
        blood_group TEXT,
        age INTEGER,
        gender TEXT,
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Doctors table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        specialization TEXT NOT NULL,
        qualification TEXT NOT NULL,
        experience_years INTEGER NOT NULL,
        hospital TEXT NOT NULL,
        location TEXT NOT NULL,
        consultation_fee INTEGER NOT NULL,
        rating REAL DEFAULT 4.8,
        reviews_count INTEGER DEFAULT 120,
        image_url TEXT,
        bio TEXT,
        available_days TEXT, -- JSON array e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
        available_time_slots TEXT -- JSON array e.g. ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"]
    )
    ''')

    # Appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_id INTEGER NOT NULL,
        doctor_name TEXT NOT NULL,
        doctor_specialty TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        consultation_type TEXT NOT NULL DEFAULT 'In-Person', -- 'In-Person' or 'Video Call'
        symptoms_summary TEXT,
        status TEXT NOT NULL DEFAULT 'Upcoming', -- 'Upcoming', 'Completed', 'Cancelled'
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(patient_id) REFERENCES users(id),
        FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    )
    ''')

    # Medical Records & Prescriptions table (EHR)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        record_type TEXT NOT NULL, -- 'Prescription', 'Lab Report', 'Diagnostic Scan', 'Clinical Note'
        doctor_name TEXT,
        record_date TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        diagnosis TEXT,
        prescribed_medications TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(patient_id) REFERENCES users(id)
    )
    ''')

    # Patient Vitals Monitoring logs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vitals_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        systolic_bp INTEGER,
        diastolic_bp INTEGER,
        heart_rate INTEGER,
        blood_sugar REAL,
        temperature REAL,
        spo2 INTEGER,
        logged_date TEXT NOT NULL,
        status TEXT DEFAULT 'Normal',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(patient_id) REFERENCES users(id)
    )
    ''')

    conn.commit()

    # Seed initial mock data if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_users(cursor)

    cursor.execute("SELECT COUNT(*) FROM doctors")
    if cursor.fetchone()[0] == 0:
        seed_doctors(cursor)

    cursor.execute("SELECT COUNT(*) FROM vitals_logs")
    if cursor.fetchone()[0] == 0:
        seed_vitals(cursor)

    cursor.execute("SELECT COUNT(*) FROM appointments")
    if cursor.fetchone()[0] == 0:
        seed_appointments(cursor)

    cursor.execute("SELECT COUNT(*) FROM medical_records")
    if cursor.fetchone()[0] == 0:
        seed_medical_records(cursor)

    conn.commit()
    conn.close()

def seed_users(cursor):
    demo_patient_pw = hash_password("patient123")
    demo_doctor_pw = hash_password("doctor123")

    cursor.execute('''
    INSERT INTO users (name, email, password_hash, role, phone, blood_group, age, gender, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        "Sarah Jenkins",
        "sarah@example.com",
        demo_patient_pw,
        "patient",
        "+1 (555) 234-5678",
        "O+",
        29,
        "Female",
        "Penicillin, Peanuts"
    ))

    cursor.execute('''
    INSERT INTO users (name, email, password_hash, role, phone, blood_group, age, gender, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        "Dr. Marcus Vance",
        "marcus@hospital.org",
        demo_doctor_pw,
        "doctor",
        "+1 (555) 987-6543",
        "A+",
        45,
        "Male",
        "None"
    ))

def seed_doctors(cursor):
    doctors_data = [
        (
            "Dr. Marcus Vance",
            "marcus@hospital.org",
            "Cardiologist",
            "MD, FACC - Harvard Medical School",
            16,
            "Metro Heart & Vascular Institute",
            "Boston, MA",
            150,
            4.9,
            312,
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
            "Senior Cardiologist specializing in preventive cardiology, coronary interventions, and hypertension management.",
            json.dumps(["Mon", "Tue", "Wed", "Thu", "Fri"]),
            json.dumps(["09:00 AM", "10:30 AM", "02:00 PM", "04:00 PM"])
        ),
        (
            "Dr. Elena Rostova",
            "elena@dermalab.com",
            "Dermatologist",
            "MD, FAAD - Johns Hopkins University",
            12,
            "Apex Dermatology & Skin Surgery",
            "New York, NY",
            120,
            4.85,
            245,
            "https://images.unsplash.com/photo-1594824813637-8e6587c69992?w=400&auto=format&fit=crop&q=80",
            "Board-certified dermatologist expert in acute skin eruptions, psoriasis, eczema, acne therapies, and dermatologic diagnostics.",
            json.dumps(["Mon", "Wed", "Fri", "Sat"]),
            json.dumps(["10:00 AM", "11:30 AM", "03:00 PM", "05:00 PM"])
        ),
        (
            "Dr. Rajiv Sharma",
            "rajiv@neurohealth.com",
            "Neurologist",
            "DM Neurology, MBBS - Stanford Health",
            18,
            "Central Neurological Center",
            "San Francisco, CA",
            175,
            4.95,
            418,
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
            "Specialist in migraine syndromes, neuromuscular conditions, vestibular vertigo, and cerebrovascular health.",
            json.dumps(["Tue", "Thu", "Sat"]),
            json.dumps(["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"])
        ),
        (
            "Dr. Aisha Patel",
            "aisha@careclinic.org",
            "General Physician",
            "MBBS, MD Internal Medicine - Oxford",
            10,
            "Grace Community Health Center",
            "Chicago, IL",
            90,
            4.78,
            180,
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
            "Primary care physician focusing on infectious diseases, typhoid, dengue, fever management, and comprehensive family health.",
            json.dumps(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
            json.dumps(["08:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM"])
        ),
        (
            "Dr. David Kim",
            "david@gastrocenter.com",
            "Gastroenterologist",
            "MD, FACG - Columbia University",
            14,
            "Digestive Disease Specialists",
            "Seattle, WA",
            140,
            4.88,
            270,
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
            "Expert in GERD, peptic ulcer disease, hepatitis management, jaundice, and irritable bowel disorders.",
            json.dumps(["Mon", "Tue", "Thu", "Fri"]),
            json.dumps(["09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM"])
        ),
        (
            "Dr. Rachel Greenwald",
            "rachel@pulmoair.org",
            "Pulmonologist",
            "MD, FCCP - Mayo Clinic College of Medicine",
            15,
            "Summit Respiratory Institute",
            "Denver, CO",
            160,
            4.92,
            330,
            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80",
            "Dedicated to bronchial asthma, chronic pulmonary infections, pneumonia recovery, and respiratory wellness.",
            json.dumps(["Wed", "Thu", "Fri", "Sat"]),
            json.dumps(["10:00 AM", "12:00 PM", "02:30 PM", "04:30 PM"])
        ),
        (
            "Dr. Nathan Cole",
            "nathan@orthocare.com",
            "Orthopedic",
            "MS Ortho, FAAOS - UCLA Medical Center",
            20,
            "Cole Joint & Spine Pavilion",
            "Los Angeles, CA",
            165,
            4.89,
            395,
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
            "Renowned orthopedic surgeon specializing in osteoarthritis, cervical spondylosis, joint reconstruction, and sports injuries.",
            json.dumps(["Mon", "Wed", "Thu"]),
            json.dumps(["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"])
        ),
        (
            "Dr. Sophia Bennett",
            "sophia@endobalance.org",
            "Endocrinologist",
            "MD Endocrinology - Yale School of Medicine",
            11,
            "Endocrine & Diabetes Care Center",
            "Philadelphia, PA",
            135,
            4.82,
            210,
            "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80",
            "Comprehensive care for Type 1 & 2 Diabetes, thyroid imbalances (hypo/hyperthyroidism), and metabolic wellness.",
            json.dumps(["Mon", "Tue", "Wed", "Fri"]),
            json.dumps(["09:30 AM", "11:30 AM", "02:00 PM", "04:00 PM"])
        )
    ]

    cursor.executemany('''
    INSERT INTO doctors (
        name, email, specialization, qualification, experience_years, hospital, location,
        consultation_fee, rating, reviews_count, image_url, bio, available_days, available_time_slots
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', doctors_data)

def seed_vitals(cursor):
    vitals = [
        (1, 120, 80, 72, 95.0, 98.6, 99, "2026-09-20", "Normal", "Routine morning check"),
        (1, 124, 82, 75, 102.0, 98.4, 98, "2026-09-22", "Normal", "Post-exercise reading"),
        (1, 118, 78, 68, 92.0, 98.7, 99, "2026-09-24", "Normal", "Normal resting vitals")
    ]
    cursor.executemany('''
    INSERT INTO vitals_logs (
        patient_id, systolic_bp, diastolic_bp, heart_rate, blood_sugar,
        temperature, spo2, logged_date, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', vitals)

def seed_appointments(cursor):
    appointments = [
        (
            1, "Sarah Jenkins", 1, "Dr. Marcus Vance", "Cardiologist",
            "2026-09-28", "10:30 AM", "In-Person",
            "Mild palpitations and occasional chest tightness after strenuous cardio.",
            "Upcoming", "Patient advised to bring recent ECG if available."
        ),
        (
            1, "Sarah Jenkins", 2, "Dr. Elena Rostova", "Dermatologist",
            "2026-09-12", "03:00 PM", "Video Call",
            "Seasonal skin dryness and mild redness.",
            "Completed", "Prescribed hydrating topical barrier cream."
        )
    ]
    cursor.executemany('''
    INSERT INTO appointments (
        patient_id, patient_name, doctor_id, doctor_name, doctor_specialty,
        appointment_date, time_slot, consultation_type, symptoms_summary,
        status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', appointments)

def seed_medical_records(cursor):
    records = [
        (
            1, "Blood Panel & Lipid Profile", "Lab Report", "Dr. Marcus Vance",
            "2026-09-10", "sample_blood_test.pdf", "/uploads/sample_blood_test.pdf",
            245000, "application/pdf", "Normal lipid and glucose levels",
            "Omega-3 supplement 1000mg once daily", "All markers in optimal range."
        ),
        (
            1, "Dermatology Prescription", "Prescription", "Dr. Elena Rostova",
            "2026-09-12", "sample_prescription.pdf", "/uploads/sample_prescription.pdf",
            128000, "application/pdf", "Contact dermatitis / mild xerosis",
            "Hydrocortisone cream 1% topical, Cetaphil gentle cleanser", "Apply twice daily for 7 days."
        )
    ]
    cursor.executemany('''
    INSERT INTO medical_records (
        patient_id, title, record_type, doctor_name, record_date,
        file_name, file_path, file_size, mime_type, diagnosis,
        prescribed_medications, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', records)
