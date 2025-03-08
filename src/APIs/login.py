import logging
import sqlite3
import sqlitecloud
import os
from typing import Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status

# --- Cloud Database Configuration ---
CLOUD_DATABASE_CONNECTION_STRING = os.environ.get("CLOUD_DATABASE_CONNECTION_STRING", "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble Database?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o")

# --- Logging Setup ---
logging.basicConfig(
    filename="login.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# --- Pydantic Model ---
class Login(BaseModel):
    email: str
    password: str

# --- Security Configuration ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# --- Database Connection ---
def get_db_connection():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# --- Password Verification ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- JWT Token Creation ---
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Get User ID from Token ---
def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT ID FROM users WHERE email = ?", (email,))
            user_id = cursor.fetchone()
        finally:
            conn.close()

        if user_id is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user_id[0]

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login/")
async def login_user(login_data: Login):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT ID, firstName, lastName, contactNumber, email, password FROM users WHERE email = ?", (login_data.email,))
        user = cursor.fetchone()

        if not user:
            logger.warning(f"Login failed: No user found with email {login_data.email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        user_id, first_name, last_name, contact_number, email, hashed_password = user

        if not verify_password(login_data.password, hashed_password):
            logger.warning(f"Login failed: Incorrect password for email {email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)

        refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(data={"sub": email}, expires_delta=refresh_token_expires)

        logger.info(f"User {email} logged in successfully")

        response = Response(content=b'{"message": "Login successful"}', media_type="application/json")
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False) # set secure=True in production.
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False) # set secure=True in production.
        return response

    except sqlite3.Error as e:
        logger.error(f"Database error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Database error"})
    except Exception as e:
        logger.exception(f"Unexpected error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
    finally:
        conn.close()

@app.get("/test_protected/")
async def test_protected(user_id: int = Depends(get_current_user)):
    return {"user_id": user_id, "message": "You are authenticated."}

@app.post("/refresh_token/")
async def refresh_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)

        response = Response(content=b'{"message": "Token refreshed"}', media_type="application/json")
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False) # set secure=True in production.

        return response

    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")