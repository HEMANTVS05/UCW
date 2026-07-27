import sys
import uuid
import datetime
from pathlib import Path
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    display_name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
    phone_number = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=True)
    profile_photo = Column(String(255), nullable=True)
    area = Column(String(100), nullable=True)
    google_id = Column(String(255), nullable=True)
    email_verified = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
