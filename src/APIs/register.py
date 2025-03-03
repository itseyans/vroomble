from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import os  # Import the os module
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

DATABASE_DIR = r"C:\Users\456\Desktop\setj\Vroomble Dataset" #using raw string to avoid escape sequence issues.
DATABASE_FILE = "users.db"
DATABASE_URL = os.path.join(DATABASE_DIR, DATABASE_FILE) #use os.path.join for path creation.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    contactNumber: str
    email: str
    password: str

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_table():
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            contactNumber TEXT,
            email TEXT UNIQUE,
            hashed_password TEXT
        )
    """)
    conn.commit()
    conn.close()

create_table()  # Ensure the table exists on startup

@app.post("/register/")
def create_user(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (firstName, lastName, contactNumber, email, hashed_password)
            VALUES (?, ?, ?, ?, ?)
        """, (user.firstName, user.lastName, user.contactNumber, user.email, hashed_password))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        result = cursor.fetchone()

        conn.close()

        if result:
            return {
                "id": result[0],
                "firstName": result[1],
                "lastName": result[2],
                "contactNumber": result[3],
                "email": result[4]
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to retrieve user after creation")

    except sqlite3.IntegrityError as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))