import os
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from ..database import get_db, hash_password, verify_password
from ..models.schema import UserRegister, UserLogin, UserResponse, TokenResponse

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-healthcare-platform-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (int(user_id),))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(row)

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email.lower(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email is already registered")

    pw_hash = hash_password(user_data.password)
    cursor.execute('''
    INSERT INTO users (name, email, password_hash, role, phone, blood_group, age, gender, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_data.name,
        user_data.email.lower(),
        pw_hash,
        user_data.role,
        user_data.phone,
        user_data.blood_group,
        user_data.age,
        user_data.gender,
        user_data.allergies
    ))
    new_user_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (new_user_id,))
    user_row = dict(cursor.fetchone())
    conn.close()

    user_row.pop("password_hash", None)
    access_token = create_access_token(data={"sub": str(user_row["id"]), "role": user_row["role"]})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user_row)
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (credentials.email.lower(),))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(credentials.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_dict = dict(row)
    user_dict.pop("password_hash", None)
    access_token = create_access_token(data={"sub": str(user_dict["id"]), "role": user_dict["role"]})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user_dict)
    )

@router.post("/demo-login/{role}", response_model=TokenResponse)
def demo_login(role: str):
    """Instant login endpoint for testing either as Patient or Doctor"""
    target_role = "doctor" if role.lower() == "doctor" else "patient"
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE role = ? LIMIT 1", (target_role,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"No demo user found for role {target_role}")

    user_dict = dict(row)
    user_dict.pop("password_hash", None)
    access_token = create_access_token(data={"sub": str(user_dict["id"]), "role": user_dict["role"]})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user_dict)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user_dict = current_user.copy()
    user_dict.pop("password_hash", None)
    return UserResponse(**user_dict)

@router.put("/profile", response_model=UserResponse)
def update_profile(data: dict, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    allowed_fields = ["name", "phone", "blood_group", "age", "gender", "allergies"]
    updates = []
    values = []

    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = ?")
            values.append(data[field])

    if updates:
        values.append(current_user["id"])
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, tuple(values))
        conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (current_user["id"],))
    updated_user = dict(cursor.fetchone())
    conn.close()

    updated_user.pop("password_hash", None)
    return UserResponse(**updated_user)
