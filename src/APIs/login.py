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
from dotenv import load_dotenv  # Import load_dotenv

# ✅ Load Environment Variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# ✅ Fetch API Key & Secret Key
SQLITE_CLOUD_API_KEY = os.environ.get("SQLITE_CLOUD_API_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")  # Use environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 days

# ✅ SQLite Cloud Connection String
CLOUD_DATABASE_CONNECTION_STRING = f"sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble_Database.db?apikey={SQLITE_CLOUD_API_KEY}"

# ✅ Check & Establish Connection
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

# ✅ Security Configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Pydantic Model for Login
class Login(BaseModel):
    email: str
    password: str

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

# ✅ JWT Token Creation (Updated to Include `contactNumber`)
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

# ✅ Get User Data (Including `contactNumber`) from Token
def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        users_ID: int = payload.get("users_ID")
        contact_number: str = payload.get("contactNumber")  # ✅ Extract `contactNumber`

        if users_ID is None or contact_number is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"users_ID": users_ID, "contactNumber": contact_number}  # ✅ Return both

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Updated Login API to Include `contactNumber` in Token
@app.post("/login/")
async def login_user(login_data: Login, response: Response):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT users_ID, firstName, lastName, contactNumber, email, password FROM users WHERE email = ?", (login_data.email,))
            user = cursor.fetchone()

        if not user:
            logger.warning(f"❌ Login failed: No user found with email {login_data.email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        users_ID, first_name, last_name, contact_number, email, hashed_password = user

        if not verify_password(login_data.password, hashed_password):
            logger.warning(f"❌ Login failed: Incorrect password for email {email}")
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        # ✅ Clear old tokens before setting new ones
        response.delete_cookie("access_token", path="/", domain=None)
        response.delete_cookie("refresh_token", path="/", domain=None)

        # ✅ Include `contactNumber` in the Token Payload
        token_payload = {
            "sub": email,
            "users_ID": users_ID,
            "contactNumber": contact_number  # ✅ Added `contactNumber`
        }

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data=token_payload, expires_delta=access_token_expires)

        refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(data=token_payload, expires_delta=refresh_token_expires)

        logger.info(f"✅ User {email} logged in successfully")

        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, path="/")
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, path="/")

        return {"message": "Login successful"}

    except sqlitecloud.Error as e:
        logger.error(f"❌ Database error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Database error"})
    except Exception as e:
        logger.exception(f"❌ Unexpected error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

# ✅ Logout API (Clears Cookies)
@app.post("/logout/")
async def logout(response: Response):
    """
    Logs out the user by clearing JWT tokens from cookies.
    """
    response.delete_cookie("access_token")  # ✅ Remove access token
    response.delete_cookie("refresh_token")  # ✅ Remove refresh token
    return {"message": "Logged out successfully"}

# ✅ Root API Endpoint
@app.get("/")
async def root():
    return {"message": "🚀 Authentication API is running!"}
