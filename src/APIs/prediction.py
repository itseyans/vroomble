from fastapi import FastAPI, Query
import pandas as pd
import joblib
from typing import List

app = FastAPI()

# Load dataset
dataset_path = r"C:\Users\HP\Documents\GitHub\vroomble\Vroomble Dataset\vroomble_car_datasets.xlsx"
sheets = pd.read_excel(dataset_path, sheet_name=None)

# Load trained model and scaler
model_path = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\trained_model.pkl"
scaler_path = r"C:\Users\HP\Documents\GitHub\vroomble\src\AI\scaler.pkl"

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

@app.get("/predict_price")
def predict_price(model_name: str, parts: List[str] = Query([]), months: int = 12):
    """Predict car price based on model, selected modifications, and inflation over months."""
    
    # Ensure model exists
    if model_name not in sheets["Car_Model"]["Model"].values:
        return {"error": f"Model '{model_name}' not found."}

    # Get base price and inflation rate
    base_price = sheets["Car_Model"].loc[sheets["Car_Model"]["Model"] == model_name, "Base_Price_PHP"].values[0]
    inflation_rate = sheets["Car_Model"].loc[sheets["Car_Model"]["Model"] == model_name, "Monthly_Inflation_Rate"].values[0]

    # Calculate modification cost
    if parts:
        modification_costs = sheets["Car_Modifications"][
            (sheets["Car_Modifications"]["Model"] == model_name) &
            (sheets["Car_Modifications"]["Car_Part"].isin(parts))
        ]["Modification_Cost_PHP"].sum()
    else:
        modification_costs = 0

    # Apply inflation effect over months
    future_inflation = (1 + inflation_rate) ** months

    # Scale inputs and predict
    scaled_features = scaler.transform([[base_price * future_inflation, modification_costs, inflation_rate]])
    predicted_price = model.predict(scaled_features)[0]

    return {
        "base_price": base_price,
        "modification_costs": modification_costs,
        "predicted_price": predicted_price,
        "months": months
    }
