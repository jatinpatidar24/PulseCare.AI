# PulseCare.AI — Intelligent Healthcare & Telehealth Platform

A full-fledged, modern healthcare web application featuring **clinical machine learning disease prediction**, **specialist doctor recommendation**, **appointment booking & telehealth management**, **Electronic Health Records (EHR) prescription uploads**, **patient vitals monitoring**, and an **interactive conversational AI triage assistant**.

---

## 🌟 Key Features

### 1. 🧬 Machine Learning Disease Prediction Engine
- Trained **Random Forest Classifier** (`scikit-learn`) on 41 distinct clinical conditions and 130+ symptoms.
- Real-time probability scoring, differential diagnoses, condition severity ratings (Mild, Moderate, High, Emergency), and recommended medical precautions.
- Automatic routing to the right medical specialty (Cardiologist, Dermatologist, Neurologist, Pulmonologist, Gastroenterologist, Endocrinologist, Orthopedic, etc.).

### 2. 💬 AI Health Assistant (Conversational Triage Chatbot)
- Multi-turn conversational interface accessible anywhere in the app.
- **Hybrid AI Engine**:
  - Local clinical NLP entity extractor and synonym dictionary mapping natural language queries (e.g., *"my head is pounding and I feel lightheaded"*) to medical symptoms and predictions with zero latency.
  - Optional **Google Gemini API** integration for enhanced clinical empathy and dialogue.
- In-chat specialist recommendations with instant 1-click booking.

### 3. 👨‍⚕️ Doctor Directory & Specialization Matching
- Verified profiles across Cardiology, Dermatology, Neurology, Orthopedics, Gastroenterology, Pulmonology, Endocrinology, and General Medicine.
- Detailed doctor qualifications, hospital affiliations, ratings, experience years, fees, and real-time slot availability.
- Multi-criteria search and filter by specialty and ratings.

### 4. 📅 Appointment Scheduling & Telehealth
- Interactive booking flow with datepicker, time-slot selection, consultation mode (*In-Person* or *HD Video Call*), and chief complaint notes.
- Slot conflict detection preventing double-booking.
- Status tracking (*Upcoming*, *Completed*, *Cancelled*) with patient actions.
- Simulated end-to-end encrypted video consultation room.

### 5. 📂 Electronic Health Records (EHR) & Prescription Uploads
- Patient document management for prescriptions, lab panels, diagnostic imaging, and discharge summaries.
- Supports PDF, PNG, JPG, and WEBP formats with direct preview/download links.
- Stores prescribed medications, dosages, clinical diagnosis, and physician notes.

### 6. 💓 Patient Vitals & Health Monitoring
- Track blood pressure (Systolic/Diastolic), heart rate (BPM), blood sugar (mg/dL), oxygen saturation (SpO2), and temperature (°F).
- Dynamic physiological range indicators and historical biomarker tracking.

### 7. 🔐 User Authentication & Multi-Role Portals
- JWT bearer token authentication with bcrypt password hashing.
- Role-based experience: **Patient Portal** and **Doctor Dashboard**.
- **1-Click Instant Demo Logins**:
  - **Demo Patient**: Sarah Jenkins (`sarah@example.com` / `patient123`)
  - **Demo Doctor**: Dr. Marcus Vance (`marcus@hospital.org` / `doctor123`)

---

## 🏗️ Architecture & Tech Stack

```
AI-healthcare/
├── backend/
│   ├── app/
│   │   ├── ml/             # ML dataset, Random Forest training & NLP extractor
│   │   ├── models/         # Pydantic schemas for requests/responses
│   │   ├── routes/         # auth, doctors, appointments, records, predict, chat
│   │   ├── database.py     # SQLite persistence with schema migrations & auto-seeding
│   │   └── main.py         # FastAPI application entrypoint & static upload mount
│   ├── uploads/            # Secure storage for uploaded prescriptions and documents
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, DoctorCard, BookingModal, SymptomChatbot
│   │   ├── pages/          # Home, DiseasePredictor, Doctors, Appointments, EHR, Vitals, DoctorDashboard, Login, Register
│   │   ├── context/        # AuthContext (JWT session management)
│   │   └── services/       # Centralized Axios API client
│   ├── package.json
│   └── vite.config.js      # Vite 8 with Tailwind CSS v4 and backend API proxying
```

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Axios.
- **Backend**: Python 3.14, FastAPI, Uvicorn, Scikit-learn, NumPy, Pandas, PyJWT, bcrypt, HTTPX.
- **Database**: SQLite3 (`healthcare.db`).

---

## 🚀 Running the Project

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Run

```bash
# Navigate to project root
cd /Users/jatinpatidar/Documents/AI-healthcare

# Activate virtual environment
source backend/venv/bin/activate

# Install dependencies (already prepared)
pip install -r backend/requirements.txt

# Start FastAPI server on port 8000
PYTHONPATH=backend python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be available at: **`http://127.0.0.1:8000`**  

### 2. Frontend Setup & Run

```bash
# In a separate terminal tab
cd /Users/jatinpatidar/Documents/AI-healthcare/frontend

# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev 
```

Frontend application will be accessible at: **`http://127.0.0.1:5173`**

---

## 🧪 Testing the Platform

1. **Instant Exploration**:
   - Open `http://127.0.0.1:5173`.
   - Click **"Demo Patient"** in the top navigation or login modal to explore as Sarah Jenkins.
   - Or click **"Sign In"** > **"Demo Doctor"** to explore the physician appointment schedule.
2. **Symptom Checker**:
   - Head to the **"Symptom Checker"** tab or select a 1-click tile on the homepage.
   - Pick symptoms (e.g. `chest_pain`, `breathlessness`, `sweating` or `itching`, `skin_rash`).
   - Click **"Predict Disease & Find Doctors"** to see ML probability calculations, precautions, and specialist matches.
3. **AI Chatbot**:
   - Click the floating **"AI Triage Assistant"** bubble in the bottom right corner.
   - Type naturally: *"I have had a high fever and joint pain for two days."*
4. **Book Appointment**:
   - Select any doctor card, pick a date and time slot, and click **"Confirm Appointment"**.
5. **Electronic Health Records (EHR)**:
   - Navigate to **"EHR & Records"**, upload a PDF or image prescription, view diagnosis, and test downloading.
6. **Vitals Monitoring**:
   - Check the **"Vitals Monitor"** tab to view resting heart rate, blood pressure, glucose, and log new readings.

---

## 🛡️ License & Disclaimer
This software is developed for clinical and educational exploration. For actual medical emergencies, always consult qualified healthcare practitioners or call emergency response services.
≠`=