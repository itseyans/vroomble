import logging
import sqlite3
import sqlitecloud
import os
from typing import Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt

# --- Cloud Database Configuration ---
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/users.db?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"

# --- Logging Setup ---
logging.basicConfig(
    filename="login.log",  # Separate log file for login
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
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")  # Important: Use environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Database Connection ---
def get_db_connection():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except Exception as e:
        logger.error(f"Error connecting to cloud database: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

# --- Password Verification ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- JWT Token Creation ---
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- User ID Retrieval from Token ---
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ID FROM users WHERE email = ?", (email,))
        user_id = cursor.fetchone()
        conn.close()

        if user_id is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user_id[0]

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- FastAPI App ---
app = FastAPI()

@app.post("/login/")
async def login_user(login_data: Login):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (login_data.email,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        _, firstName, lastName, contactNumber, email, hashed_password = user

        if not verify_password(login_data.password, hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except sqlite3.Error as e:
        logger.error(f"Database error during login: {e}")
        conn.close()
        return JSONResponse(status_code=500, content={"error": f"Database error: {e}"})
    except Exception as e:
        logger.exception(f"Error during login: {e}")
        conn.close()
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/test_protected/")
async def test_protected(user_id: int = Depends(get_current_user)):
    return {"user_id": user_id, "message": "You are authenticated."}