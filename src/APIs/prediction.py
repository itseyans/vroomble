from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import os

# Ensure the model files exist
MODEL_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
SCALER_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"
DATASET_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\vroomble_car_datasets.xlsx"

def load_model():
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model files not found. Please retrain and save them correctly.")
    return joblib.load(MODEL_PATH), joblib.load(SCALER_PATH)

# Load the trained model and scaler
try:
    model, scaler = load_model()
except FileNotFoundError as e:
    print(str(e))
    model, scaler = None, None

# Load the dataset to extract necessary details
if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError("Dataset file not found. Ensure the correct path is set.")

sheets = pd.read_excel(DATASET_PATH, sheet_name=None)
car_model_data = sheets.get("Car_Model")
car_modifications_data = sheets.get("Car_Modifications")

if car_model_data is None or car_modifications_data is None:
    raise ValueError("Missing required sheets in dataset. Check the Excel file format.")

# Initialize FastAPI app
app = FastAPI()

# Define request model
class PredictionRequest(BaseModel):
    car_maker: str
    car_model: str
    selected_parts: list[str]
    months: int

# Define the prediction function
def predict_price(car_maker, car_model, selected_parts, months):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please check the server logs.")
    
    # Validate if car model exists
    if not car_model_data["Model"].isin([car_model]).any():
        raise HTTPException(status_code=404, detail=f"Car model '{car_model}' not found in dataset.")
    
    # Get car details
    car_info = car_model_data[car_model_data["Model"] == car_model].iloc[0]
    base_price = car_info.get("Base_Price_PHP", 0)
    inflation_rate = car_info.get("Monthly_Inflation_Rate", 0)
    car_age = car_info.get("Car_Age", 0)  # ✅ Add missing feature

    # Get modification costs
    selected_parts_data = car_modifications_data[(car_modifications_data["Model"] == car_model) &
                                                 (car_modifications_data["Car_Part"].isin(selected_parts))]
    total_modification_cost = selected_parts_data["Modification_Cost_PHP"].sum() if not selected_parts_data.empty else 0
    
    # Apply inflation for future price estimation
    future_inflation = (1 + inflation_rate) ** months
    
    # Ensure input features are properly formatted (Match 3 Features for Scaler)
    try:
        scaled_features = scaler.transform([[base_price, total_modification_cost, inflation_rate]])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature scaling error: {str(e)}")
    
    # Predict future price
    try:
        predicted_price = model.predict(scaled_features)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
    return {
        "Car Maker": car_maker,
        "Car Model": car_model,
        "Selected Car Parts": selected_parts,
        "Car Base Price (PHP)": base_price,
        "Car Parts Price (PHP)": total_modification_cost,
        "Current Total Price (PHP)": base_price + total_modification_cost,
        "Predicted Total Price After {} Months (PHP)".format(months): predicted_price
    }

# API route for price prediction
@app.post("/predict-price")
def get_predicted_price(request: PredictionRequest):
    return predict_price(request.car_maker, request.car_model, request.selected_parts, request.months)

# Run the FastAPI server using uvicorn (command: `uvicorn prediction:app --reload`)
