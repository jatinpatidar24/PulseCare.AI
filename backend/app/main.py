import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import init_db
from .routes import auth, doctors, appointments, records, predict, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema and mock data
    init_db()
    yield

app = FastAPI(
    title="AI Healthcare Platform API",
    description="Backend services for disease prediction, doctor scheduling, EHR management, and health triage",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for medical documents and prescriptions
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(records.router)
app.include_router(predict.router)
app.include_router(chat.router)

@app.get("/api/health")
def healthcheck():
    return {
        "status": "online",
        "service": "AI Healthcare Platform API",
        "ml_model": "Random Forest Clinical Classifier",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
