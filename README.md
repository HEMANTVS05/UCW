# Nexus Urban Control Warfare (UCW) - Authentication & Dashboard

A full-stack application built with **Next.js 16 (React 19)** frontend, **Python FastAPI** backend microservice, **PostgreSQL** database storage, and **Google OAuth 2.0 Identity Authentication**.

---

## 🌟 Key Features & Accomplishments

1. **Python FastAPI Backend Microservice (`backend/`)**:
   - Asynchronous Python FastAPI application connected to PostgreSQL database (`NexusDB`).
   - CORS Middleware configured for local and production web clients.
   - Secure password hashing using `bcrypt`.
   - JWT Access Token generation & verification.
   - Google ID Token verification with Google API public keys (`google-auth`).

2. **PostgreSQL Database Storage (`users` table)**:
   - Full user persistence in PostgreSQL database (`NexusDB`).
   - Auto-creates/syncs columns (`user_id` UUID, `username`, `display_name`, `email`, `phone_number`, `area`, `password_hash`, `google_id`, `email_verified`, `created_at`).

3. **Dedicated Authentication Routes**:
   - **`/register` (Registration Page)**:
     - Includes **Google Email Verification** via Google OAuth 2.0 Popup.
     - Collects operator details (Username, Display Name, Phone Number, Sector/Area, Password).
     - Removed standalone OTP code modal/dialog box.
     - Submits profile to FastAPI `POST /api/auth/register` and stores user directly in PostgreSQL.
   - **`/login` (Login Page)**:
     - **Dual Authentication**:
       1. **Log in with Email/Username & Password** via FastAPI `POST /api/auth/login`.
       2. **Log in with Google** via FastAPI `POST /api/auth/google-login`.

4. **Brutalist Cyberpunk UI & Visual Excellence**:
   - Cyberpunk brutalist design aesthetic using Vanilla Tailwind CSS & Framer Motion.
   - Dynamic Google Identity Services SDK (`https://accounts.google.com/gsi/client`) rendering native Google authentication popups.

---

## 📁 Project Structure

```text
├── backend/
│   ├── main.py          # FastAPI server routes & app entrypoint
│   ├── auth.py          # JWT, bcrypt hashing & Google ID token verification
│   ├── database.py      # SQLAlchemy PostgreSQL database session engine
│   ├── models.py        # SQLAlchemy User database model
│   ├── schemas.py       # Pydantic request & response validation schemas
│   └── requirements.txt # Python backend dependencies
├── src/
│   ├── app/
│   │   ├── login/       # Dedicated Login Route (/login)
│   │   │   └── page.jsx
│   │   ├── register/    # Dedicated Registration Route (/register)
│   │   │   └── page.jsx
│   │   ├── page.jsx     # Main Dashboard Route (/)
│   │   └── globals.css  # Global Tailwind styles & brutalist UI tokens
│   └── components/      # UI Header, Navbar, Radar, Chat, Profile components
├── .env                 # Environment secrets (ignored by git)
├── .env.example         # Sample environment configuration template
└── .gitignore           # Git ignore configuration
```

---

## 🛠️ Environment Configuration Setup

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

### Sample `.env` Values:

```env
# Google OAuth Client ID (From https://console.cloud.google.com/apis/credentials)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# PostgreSQL Database Credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=NexusDB

# Security & Secret Keys
JWT_SECRET=supersecretjwtkey_whatsapp_demo_2026
JWT_REFRESH_SECRET=supersecretrefreshkey_whatsapp_demo_2026

# Microservice Endpoints
GO_STORAGE_URL=http://localhost:8081
PORT=8000
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.10+ or v3.11+
- **PostgreSQL**: Running locally on port 5432 with database `NexusDB`.

### 2. Install Dependencies

**Backend (Python):**
```bash
pip install -r backend/requirements.txt
```

**Frontend (Node):**
```bash
npm install
```

### 3. Run FastAPI Backend Server (Terminal 1)
From the project root directory:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
> Verify server status by visiting `http://localhost:8000/api/health`.

### 4. Run Next.js Frontend Server (Terminal 2)
From the project root directory:
```bash
npm run dev
```

### 5. Access the Web App
Open your browser and navigate to:
- **Registration Page**: `http://localhost:3000/register`
- **Login Page**: `http://localhost:3000/login`
- **Main Dashboard**: `http://localhost:3000/`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend server health check |
| `POST` | `/api/auth/google-verify` | Verifies Google OAuth ID token & returns email profile |
| `POST` | `/api/auth/register` | Registers new user in PostgreSQL `users` table |
| `POST` | `/api/auth/login` | Authenticates existing user by Username/Email + Password |
| `POST` | `/api/auth/google-login` | Authenticates existing or new user via Google OAuth |
| `GET` | `/api/auth/me` | Fetches current logged-in user profile from JWT header |

---

## 🛡️ Database Schema (`users` table in `NexusDB`)

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    area VARCHAR(100),
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    profile_photo VARCHAR(255),
    email_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
