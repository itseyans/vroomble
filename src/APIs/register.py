import logging
import sqlite3
from typing import Union
from datetime import datetime
from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from passlib.context import CryptContext

app = FastAPI()

DATABASE_PATH = "users.db"  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    filename="app.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

class DatabaseError(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(status_code=500, detail=detail or "Database error.")

class Registration(BaseModel):
    firstName: str
    lastName: str
    contactNumber: str
    email: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def create_table_if_not_exists():
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                contactNumber TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
            """
        )
        conn.commit()
        conn.close()
        logger.info("Local database table 'users' created (if not already existing).")
        print("Local database table 'users' initialized!")
    except sqlite3.Error as e:
        logger.error(f"Error initializing local database table: {e}")
        raise DatabaseError(detail=f"Local database table initialization error: {e}")

create_table_if_not_exists()

@app.post("/register/")
async def register_user(registration_data: Registration):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        hashed_password = hash_password(registration_data.password)
        cursor.execute(
            """
            INSERT INTO users (firstName, lastName, contactNumber, email, password)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                registration_data.firstName,
                registration_data.lastName,
                registration_data.contactNumber,
                registration_data.email,
                hashed_password,
            ),
        )
        conn.commit()
        conn.close()
        return {"message": "User registered successfully"}
    except sqlite3.Error as e:
        logger.error(f"Database error during user registration: {e}")
        return JSONResponse(
            status_code=500, content={"error": f"Database error: {e}"}
        )
    except Exception as e:
        logger.exception(f"Error during registration: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# ... (rest of your existing code: /submit_form/, /cars/form/, etc.)

@app.get("/")
async def root():
    return {"message": "Vehicle registration API"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": str(exc)},
    )