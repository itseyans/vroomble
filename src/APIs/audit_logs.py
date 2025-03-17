import requests
import logging
import sqlitecloud  # Ensure it's installed
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse


# Function to log actions in Audit Log API
def log_action(user_id, action, description, status, request: Request):
    audit_api_url = "http://localhost:8002/audit-logs/"  # Update with actual host
    log_data = {
        "user_id": user_id if user_id else 0,  # 0 for unknown user (failed attempts)
        "action": action,
        "description": description,
        "status": status,
    }
    try:
        requests.post(audit_api_url, params=log_data)
    except Exception as e:
        print(" Error logging action:", e)

#  Login API (Now Includes Audit Logging)
@app.post("/login/")
async def login_user(login_data: Login, response: Response, request: Request):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT users_ID, firstName, lastName, contactNumber, region, email, password FROM users WHERE email = ?", (login_data.email,))
            user = cursor.fetchone()

        if not user:
            logger.warning(f" Login failed: No user found with email {login_data.email}")
            log_action(None, "Login Attempt", f"Failed login for {login_data.email}", "Failed", request)
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        users_ID, first_name, last_name, contact_number, region, email, hashed_password = user

        if not verify_password(login_data.password, hashed_password):
            logger.warning(f" Login failed: Incorrect password for email {email}")
            log_action(users_ID, "Login Attempt", f"Failed login for {email} (Incorrect password)", "Failed", request)
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        #  Clear old tokens before setting new ones
        response.delete_cookie("access_token", path="/", domain=None)
        response.delete_cookie("refresh_token", path="/", domain=None)

        #  Token Payload Includes `firstName`, `LastName`, `Region`, `ContactNumber`
        token_payload = {
            "sub": email,
            "users_ID": users_ID,
            "firstName": first_name,
            "lastName": last_name,
            "contactNumber": contact_number,
            "region": region  #  Added `region`
        }

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data=token_payload, expires_delta=access_token_expires)

        refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_refresh_token(data=token_payload, expires_delta=refresh_token_expires)

        logger.info(f" User {email} logged in successfully")
        log_action(users_ID, "Login", f"User {email} logged in successfully", "Success", request)

        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, path="/")
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, path="/")

        return {"message": "Login successful"}

    except sqlitecloud.Error as e:
        logger.error(f" Database error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Database error"})
    except Exception as e:
        logger.exception(f" Unexpected error during login: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
