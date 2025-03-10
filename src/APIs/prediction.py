from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import sqlite3
import joblib

# Paths to your scaler, model, and database
MODEL_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
SCALER_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"
DB_PATH = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\prediction_database.db"

# Load the trained model and scaler
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Initialize FastAPI app
app = FastAPI()

# Define request model
class PredictionRequest(BaseModel):
    make: str
    model_name: str
    modification_type: str
    selected_parts: list[str]
    months: int

# Prediction function
def predict_price(request: PredictionRequest):
    # Connect to SQLite database
    conn = sqlite3.connect(DB_PATH)

    # Fetch car details
    query_car = """
        SELECT Base_Price_PHP, Monthly_Inflation_Rate FROM Car_Model
        WHERE Make = ? AND Model = ?
    """
    car_info = pd.read_sql_query(query_car, conn, params=(request.make, request.model_name))

    if car_info.empty:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Car '{request.make} {request.model_name}' not found.")

    base_price = car_info.iloc[0]["Base_Price_PHP"]
    inflation_rate = car_info.iloc[0]["Monthly_Inflation_Rate"]

    # Fetch modification cost
    placeholders = ','.join('?' for _ in request.selected_parts)
    query_mod = f"""
        SELECT SUM(Modification_Cost_PHP) as mod_cost FROM Car_Modifications
        WHERE Modification_Type = ? AND Model = ? AND Car_Part IN ({placeholders})
    """
    params = [request.modification_type, request.model_name] + request.selected_parts
    mod_df = pd.read_sql_query(query_mod, conn, params=params)
    modification_cost = mod_df.iloc[0]["mod_cost"] or 0

    # Calculate future price considering inflation
    future_inflation = (1 + inflation_rate) ** request.months

    # Scale input features
    features_scaled = scaler.transform([[base_price * future_inflation, modification_cost, inflation_rate]])

    # Predict future price
    predicted_price = model.predict(features_scaled)[0]

    conn.close()

    # Prepare result
    return {
        "Make": request.make,
        "Model": request.model_name,
        "Modification Type": request.modification_type,
        "Selected Car Parts": request.selected_parts,
        "Base Price (PHP)": base_price,
        "Car Parts Cost (PHP)": modification_cost,
        "Current Total Price (PHP)": base_price + modification_cost,
        f"Predicted Price After {request.months} Months (PHP)": predicted_price
    }

@app.post("/predict-price")
def get_predicted_price(request: PredictionRequest):
    try:
        result = predict_price(request)

        # Explicitly convert numpy types to native Python types for JSON serialization
        result = {
            "Make": result["Make"],
            "Model": result["Model"],
            "Modification Type": result["Modification Type"],
            "Selected Car Parts": result["Selected Car Parts"],
            "Base Price (PHP)": float(result["Base Price (PHP)"]),
            "Car Parts Cost (PHP)": float(result["Car Parts Cost (PHP)"]),
            "Current Total Price (PHP)": float(result["Current Total Price (PHP)"]),
            f"Predicted Price After {request.months} Months (PHP)": float(result[f"Predicted Price After {request.months} Months (PHP)"])
        }

        return result
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
