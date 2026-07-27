import os
import sys
import uuid
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import database
import models
import schemas
import auth

# Initialize FastAPI App
app = FastAPI(
    title="Nexus Auth API",
    description="Python FastAPI Authentication & User Registration service with PostgreSQL & Google OAuth",
    version="1.0.0"
)

# Configure CORS Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Ensure PostgreSQL tables exist
@app.on_event("startup")
def startup_event():
    try:
        models.Base.metadata.create_all(bind=database.engine)
        print("[SUCCESS] PostgreSQL Database connection verified and tables initialized.")
    except Exception as e:
        print(f"[WARNING] Database initialization exception: {e}")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Nexus FastAPI Authentication"}

# ----------------------------------------------------
# 1. Google OAuth Token Verification Endpoint
# ----------------------------------------------------
@app.post("/api/auth/google-verify", response_model=schemas.GoogleVerifyResponse)
def google_verify(payload: schemas.GoogleVerifyRequest):
    if not payload.id_token:
        raise HTTPException(status_code=400, detail="id_token is required")
    
    verified_info = auth.verify_google_id_token(payload.id_token)
    return verified_info

# ----------------------------------------------------
# 2. User Registration Endpoint
# ----------------------------------------------------
@app.post("/api/auth/register", response_model=schemas.AuthTokenResponse)
def register_user(req: schemas.UserRegisterRequest, db: Session = Depends(database.get_db)):
    # Check if username or email already exists in PostgreSQL
    existing_username = db.query(models.User).filter(models.User.username.ilike(req.username.strip())).first()
    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="USERNAME_ALREADY_TAKEN"
        )
        
    existing_email = db.query(models.User).filter(models.User.email.ilike(req.email.strip())).first()
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="EMAIL_ALREADY_REGISTERED"
        )

    # Hash password securely
    hashed_pwd = auth.get_password_hash(req.password)
    
    # Create new User model instance with UUID user_id
    new_user = models.User(
        user_id=uuid.uuid4(),
        username=req.username.strip(),
        display_name=req.display_name.strip() if req.display_name else req.username.strip(),
        email=req.email.strip().lower(),
        phone_number=req.phone.strip() if req.phone else None,
        area=req.area or "SALIGRAMAM_SEC",
        password_hash=hashed_pwd,
        google_id=req.google_token[:50] if req.google_token else None,
        email_verified=True,
        profile_photo=None
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate JWT token
    access_token = auth.create_access_token(data={"sub": new_user.username, "email": new_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

# ----------------------------------------------------
# 3. User Login Endpoint (Email/Username + Password)
# ----------------------------------------------------
@app.post("/api/auth/login", response_model=schemas.AuthTokenResponse)
def login_user(req: schemas.UserLoginRequest, db: Session = Depends(database.get_db)):
    identifier = req.identifier.strip().lower()
    
    user = db.query(models.User).filter(
        (models.User.username.ilike(identifier)) | (models.User.email.ilike(identifier))
    ).first()
    
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="INVALID_CREDENTIALS"
        )
        
    access_token = auth.create_access_token(data={"sub": user.username, "email": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# ----------------------------------------------------
# 4. Google Direct Login Endpoint
# ----------------------------------------------------
@app.post("/api/auth/google-login", response_model=schemas.AuthTokenResponse)
def google_login(payload: schemas.GoogleVerifyRequest, db: Session = Depends(database.get_db)):
    if not payload.id_token:
        raise HTTPException(status_code=400, detail="id_token is required")
    
    google_info = auth.verify_google_id_token(payload.id_token)
    email = google_info["email"].lower()

    user = db.query(models.User).filter(models.User.email.ilike(email)).first()
    
    if not user:
        base_username = (google_info.get("name") or email.split("@")[0]).replace(" ", "_").lower()
        username = base_username
        suffix = 1
        while db.query(models.User).filter(models.User.username.ilike(username)).first():
            username = f"{base_username}_{suffix}"
            suffix += 1
            
        hashed_pwd = auth.get_password_hash(str(uuid.uuid4()))
        
        user = models.User(
            user_id=uuid.uuid4(),
            username=username,
            display_name=google_info.get("name") or username,
            email=email,
            phone_number=None,
            area="SALIGRAMAM_SEC",
            password_hash=hashed_pwd,
            google_id=google_info.get("sub"),
            email_verified=True,
            profile_photo=google_info.get("picture")
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.username, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# ----------------------------------------------------
# 5. Get Current Logged In User Endpoint
# ----------------------------------------------------
@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="NOT_AUTHENTICATED")
    return current_user
