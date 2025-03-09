import logging
import sqlite3 # We might still need sqlite3 for cursor and errors, but connection via sqlitecloud
import sqlitecloud
import os # Import os module to access environment variables (recommended for API key)
from typing import Union
from datetime import datetime
from fastapi import FastAPI, Form, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from passlib.context import CryptContext


app = FastAPI()

# ---  Cloud Database Configuration ---
# Use CLOUD_DATABASE_CONNECTION_STRING for the full connection string
CLOUD_DATABASE_CONNECTION_STRING = "sqlitecloud://cuf1maatnz.g6.sqlite.cloud:8860/Vroomble Database?apikey=9IwJf2Fz9xSDaQBetYibFbLhi7HrKlAEobNy9wjio9o"  #  <-  Your FULL connection string here!

# --- It's highly recommended to use environment variables for sensitive information like API keys ---
# You can set environment variables like CLOUD_DATABASE_CONNECTION_STRING
# and then access it like this:
# CLOUD_DATABASE_CONNECTION_STRING = os.environ.get("CLOUD_DATABASE_CONNECTION_STRING")


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

def get_db_connection(): # Function to get the database connection
    try:
        conn = sqlitecloud.connect(CLOUD_DATABASE_CONNECTION_STRING) # Pass connection string directly
        return conn
    except Exception as e: # Catch broader exceptions for sqlitecloud connection issues
        logger.error(f"Error connecting to cloud database: {e}")
        raise DatabaseError(detail=f"Cloud database connection error: {e}")

def create_table_if_not_exists():
    conn = get_db_connection() # Use the new function to get connection
    try:
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
        conn.close() # Close the connection after use
        logger.info("Cloud database table 'users' created (if not already existing).")
        print("Cloud database table 'users' initialized!")
    except sqlite3.Error as e: # Still using sqlite3.Error as it might be compatible with sqlitecloud
        logger.error(f"Error initializing cloud database table: {e}")
        conn.close() # Ensure connection is closed even on error
        raise DatabaseError(detail=f"Cloud database table initialization error: {e}")

#create_table_if_not_exists() # Initialize table on app startup (if not exists)

@app.post("/register/")
async def register_user(registration_data: Registration):
    conn = get_db_connection() # Use the new function to get connection
    try:
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
        conn.close() # Close the connection after use
        return {"message": "User registered successfully"}
    except sqlite3.Error as e: # Still using sqlite3.Error for error handling
        logger.error(f"Database error during user registration: {e}")
        conn.close() # Ensure connection is closed even on error
        return JSONResponse(
            status_code=500, content={"error": f"Database error: {e}"}
        )
    except Exception as e: # Catch any other potential errors during registration
        logger.exception(f"Error during registration: {e}")
        conn.close() # Ensure connection is closed even on error
        return JSONResponse(status_code=500, content={"error": str(e)})

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