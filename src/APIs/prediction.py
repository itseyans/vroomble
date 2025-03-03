from fastapi import FastAPI, Query
from typing import List
import pandas as pd
import joblib

# ✅ Initialize FastAPI app
app = FastAPI()

# ✅ Load trained model and scaler from Jupyter Notebook
model = joblib.load("trained_model.pkl")
scaler = joblib.load("scaler.pkl")

# ✅ Load dataset from Excel
dataset_path = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\vroomble_car_datasets.xlsx"
sheets = pd.read_excel(dataset_path, sheet_name=None)
car_model_data = sheets["Car_Model"]
car_modifications_data = sheets["Car_Modifications"]

# ✅ Root Endpoint (Fixes 404 Not Found)
@app.get("/")
def home():
    return {"message": "Welcome to the Vroomble AI Prediction API!"}

# ✅ Function to Predict Car Price (Same as Jupyter Notebook)
def predict_price(model_name, selected_parts, months=12):
    available_models = car_model_data["Model"].unique().tolist()

    if model_name not in available_models:
        return {"error": f"Model '{model_name}' not found."}

    # Get car details (Base Price, Inflation Rate, Car Maker)
    base_price = car_model_data[car_model_data["Model"] == model_name]["Base_Price_PHP"].values[0]
    inflation_rate = car_model_data[car_model_data["Model"] == model_name]["Monthly_Inflation_Rate"].values[0]
    car_maker = car_model_data[car_model_data["Model"] == model_name]["Make"].values[0]  # Get Car Maker

    # Get modification costs for selected parts
    modification_cost = car_modifications_data[(car_modifications_data["Model"] == model_name) &
                                               (car_modifications_data["Car_Part"].isin(selected_parts))]
    total_modification_cost = modification_cost["Modification_Cost_PHP"].sum()

    # Apply inflation over the specified months
    future_inflation = (1 + inflation_rate) ** months

    # Scale the input features
    scaled_features = scaler.transform([[base_price * future_inflation, total_modification_cost, inflation_rate]])

    # Predict price using trained model
    predicted_price = model.predict(scaled_features)[0]

    # ✅ Return the exact same format as Jupyter Notebook output
    return {
        "Car Maker": car_maker,  # ✅ Included Car Maker
        "Car Model": model_name,
        "Selected Car Parts": selected_parts,
        "Car Base Price (PHP)": base_price,
        "Car Parts Price (PHP)": total_modification_cost,
        "Current Total Price (PHP)": base_price + total_modification_cost,
        "Predicted Total Price After {} Months (PHP)".format(months): predicted_price
    }

# ✅ API Endpoint: Get Available Car Makes
@app.get("/get_makes")
def get_makes():
    makes = car_model_data["Make"].unique().tolist()
    return {"makes": makes}

# ✅ API Endpoint: Get Available Car Models for a Given Make
@app.get("/get_models")
def get_models(make: str):
    models = car_model_data[car_model_data["Make"] == make]["Model"].unique().tolist()
    return {"models": models}

# ✅ API Endpoint: Get Available Car Parts for a Given Model
@app.get("/get_car_parts")
def get_car_parts(model: str):
    parts = car_modifications_data[car_modifications_data["Model"] == model]["Car_Part"].unique().tolist()
    return {"car_parts": parts}

# ✅ API Endpoint: Predict Car Price
@app.get("/predict_price")
def api_predict_price(model: str, selected_parts: List[str] = Query(None), months: int = 12):
    return predict_price(model, selected_parts, months)
