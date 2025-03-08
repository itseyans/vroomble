from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
from pydantic import BaseModel
import os

# Initialize FastAPI app
app = FastAPI()

# Define the correct path to the AI model
MODEL_DIR = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI"
MODEL_PATH = os.path.join(MODEL_DIR, "maintenance_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

# Load the trained AI model and scaler
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)  # Ensure scaler is loaded too
except FileNotFoundError as e:
    raise RuntimeError(f"Model or scaler file not found: {str(e)}")

# Define input data model
class MaintenanceRequest(BaseModel):
    mileage: int
    age: int
    last_service_mileage: int

@app.post("/predict_maintenance")
def predict_maintenance(request: MaintenanceRequest):
    try:
        # Compute missing feature
        miles_since_last_service = request.mileage - request.last_service_mileage

        # Ensure correct feature order before scaling
        input_data = np.array([[request.mileage, request.age, request.last_service_mileage, miles_since_last_service]])

        # Scale input data
        input_data_scaled = scaler.transform(input_data)

        # Predict next service mileage
        prediction = model.predict(input_data_scaled)

        return {"next_service_mileage": int(prediction[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
