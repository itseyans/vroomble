import logging
import sqlitecloud  # Using SQLite Cloud (not local sqlite3)
import os
from typing import Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Header, Request, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from fastapi.middleware.cors import CORSMiddleware

# ✅ Define SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"

# ✅ Check and Establish Connection
try:
    with sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) as conn:
        print("✅ Successfully connected to SQLite Cloud database!")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Existing Tables:", tables)
except sqlitecloud.Error as e:
    print(f"❌ SQLite Cloud connection error: {e}")

# ✅ Logging Setup
logging.basicConfig(
    filename="login.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ✅ Pydantic Model for Login
class Login(BaseModel):
    email: str
    password: str

# ✅ Security Configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")  # Use environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ✅ Function to Get Cloud Database Connection
def get_db_connection():
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING)
        return conn
    except sqlitecloud.Error as e:
        logger.error(f"❌ Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# ✅ Password Verification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# ✅ JWT Token Creation
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

# ✅ Get User ID from Token
def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ID FROM users WHERE email = ?", (email,))
            user_id = cursor.fetchone()

        if user_id is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user_id[0]

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ FastAPI App
app = FastAPI()

# ✅ CORS Middleware (Allow Frontend Requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API Endpoint for User Login
@app.post("/login/")
async def login_user(login_data: Login):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ID, firstName, lastName, contactNumber, email, password FROM users WHERE email = ?", (login_data.email,))
            user = cursor.fetchone()

        if not user:
            logger.warning(f"❌ Login failed: No user found with email {login_data.email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        user_id, first_name, last_name, contact_number, email, hashed_password = user

        if not verify_password(login_data.password, hashed_password):
            logger.warning(f"❌ Login failed: Incorrect password for email {email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)

        refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(data={"sub": email}, expires_delta=refresh_token_expires)

        logger.info(f"✅ User {email} logged in successfully")

        response = Response(content='{"message": "Login successful"}', media_type="application/json")
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False)  # secure=True in production
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False)  # secure=True in production
        return response

    except sqlitecloud.Error as e:
        logger.error(f"❌ Database error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Database error"})
    except Exception as e:
        logger.exception(f"❌ Unexpected error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

# ✅ Protected Route for Authentication Testing
@app.get("/test_protected/")
async def test_protected(user_id: int = Depends(get_current_user)):
    return {"user_id": user_id, "message": "You are authenticated."}

# ✅ API Endpoint to Refresh JWT Token
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

        response = Response(content='{"message": "Token refreshed"}', media_type="application/json")
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False)  # secure=True in production

        return response

    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

# ✅ API Root Endpoint (Welcome Message)
@app.get("/")
async def root():
    return {"message": "🚗 Welcome to the Authentication API!"}
