from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "patient"
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    allergies: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    allergies: Optional[str] = None
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class DoctorResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    specialization: str
    qualification: str
    experience_years: int
    hospital: str
    location: str
    consultation_fee: int
    rating: float
    reviews_count: int
    image_url: Optional[str] = None
    bio: Optional[str] = None
    available_days: List[str]
    available_time_slots: List[str]

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: str
    time_slot: str
    consultation_type: str = "In-Person"
    symptoms_summary: Optional[str] = None
    notes: Optional[str] = None

class AppointmentUpdateStatus(BaseModel):
    status: str # 'Upcoming', 'Completed', 'Cancelled'
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: str
    doctor_id: int
    doctor_name: str
    doctor_specialty: str
    appointment_date: str
    time_slot: str
    consultation_type: str
    symptoms_summary: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[str] = None

class PredictRequest(BaseModel):
    symptoms: List[str]
    top_k: Optional[int] = 3

class DiseasePredictionItem(BaseModel):
    disease: str
    confidence_percentage: float
    specialization: str
    severity: str
    description: str
    precautions: List[str]

class PredictResponse(BaseModel):
    matched_symptoms: List[str]
    primary_prediction: Optional[DiseasePredictionItem] = None
    all_predictions: List[DiseasePredictionItem] = []
    recommended_specialty: str
    recommended_doctors: List[DoctorResponse] = []

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    api_key: Optional[str] = None # Optional Gemini API key if user wants richer dialogue

class ChatResponse(BaseModel):
    reply: str
    detected_symptoms: List[str] = []
    prediction: Optional[DiseasePredictionItem] = None
    recommended_doctors: List[DoctorResponse] = []
    requires_more_info: bool = False

class MedicalRecordResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    record_type: str
    doctor_name: Optional[str] = None
    record_date: str
    file_name: str
    file_url: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    diagnosis: Optional[str] = None
    prescribed_medications: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None

class VitalsCreate(BaseModel):
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    heart_rate: Optional[int] = None
    blood_sugar: Optional[float] = None
    temperature: Optional[float] = None
    spo2: Optional[int] = None
    logged_date: Optional[str] = None
    notes: Optional[str] = None

class VitalsResponse(BaseModel):
    id: int
    patient_id: int
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    heart_rate: Optional[int] = None
    blood_sugar: Optional[float] = None
    temperature: Optional[float] = None
    spo2: Optional[int] = None
    logged_date: str
    status: str
    notes: Optional[str] = None
    created_at: Optional[str] = None
