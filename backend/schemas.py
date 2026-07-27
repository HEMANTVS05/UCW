from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class GoogleVerifyRequest(BaseModel):
    id_token: str

class GoogleVerifyResponse(BaseModel):
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: Optional[str] = None
    email_verified: bool = True
    exists_in_db: bool = False

class UserRegisterRequest(BaseModel):
    username: str
    display_name: Optional[str] = None
    phone: Optional[str] = None
    area: Optional[str] = "SALIGRAMAM_SEC"
    email: EmailStr
    password: str
    google_token: Optional[str] = None

class UserLoginRequest(BaseModel):
    identifier: str  # username or email
    password: str

class UserResponse(BaseModel):
    user_id: UUID
    username: str
    display_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    area: Optional[str] = None
    profile_photo: Optional[str] = None
    email_verified: Optional[bool] = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
