"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const API_BASE_URL = "http://127.0.0.1:8006"; // Ensure this is correct

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 40px;
  background: transparent; /* Makes the container transparent */
`;
//reload
//tite  
const FormContainer = styled.div`
  min-width: 400px;
  max-width: 400px;
  padding: 20px;
  border-radius: 12px;
  background-color: #e0e0e0;
  border: 4px solid #ffc629;
  font-family: "Segoe UI Variable", sans-serif;
  color: #000; /* Explicitly set text color to black */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OutputContainer = styled.div`
  min-width: 400px;
  max-width: 400px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  background-color: #e0e0e0;
  border: 4px solid #ffc629;
  font-family: "Segoe UI Variable", sans-serif;
  color: #000; /* Explicitly set text color to black */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;


//reloafd

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color:rgb(12, 12, 12);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  color:rgb(12, 12, 12);
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color:rgb(12, 12, 12);
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  color:rgb(12, 12, 12);
`;

const EmailPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
  color:rgb(12, 12, 12);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  
`;

const PredictForm = () => {
  const [carMakers, setCarMakers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [modificationTypes, setModificationTypes] = useState([]);
  const [carParts, setCarParts] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedModification, setSelectedModification] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [predictionMonths, setPredictionMonths] = useState(12);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchCarMakers();
  }, []);

  const fetchCarMakers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/car-makers`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCarMakers(data);
    } catch (error) {
      console.error("Error fetching car makers:", error);
    }
  };

  const fetchCarModels = async (make) => {
    setSelectedMake(make);
    setSelectedModel("");
    setModificationTypes([]);
    setCarParts([]);
    try {
      const response = await fetch(`${API_BASE_URL}/car-models?make=${make}`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCarModels(data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const fetchModificationTypes = async (model) => {
    setSelectedModel(model);
    setSelectedModification("");
    setCarParts([]);
    try {
      const response = await fetch(
        `${API_BASE_URL}/modification-types?model=${model}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setModificationTypes(data);
    } catch (error) {
      console.error("Error fetching modification types:", error);
    }
  };

  const fetchCarParts = async (modification) => {
    setSelectedModification(modification);
    setCarParts([]);
    setSelectedParts([]);

    if (!selectedModel) {
      console.warn(" No model selected. Cannot fetch car parts.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/car-parts?model=${encodeURIComponent(
          selectedModel
        )}&modification_type=${encodeURIComponent(modification)}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCarParts(data);
    } catch (error) {
      console.error(" Error fetching car parts:", error);
    }
  };

  const handleCheckboxChange = (part) => {
    setSelectedParts((prevParts) =>
      prevParts.includes(part)
        ? prevParts.filter((p) => p !== part)
        : [...prevParts, part]
    );
  };

  const predictPrice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: selectedMake,
          model_name: selectedModel,
          modification_type: selectedModification,
          selected_parts: selectedParts,
          months: predictionMonths,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(" Prediction API Error:", responseData);
        alert(`Failed to predict: ${responseData.detail || "Unknown error"}`);
        throw new Error(`API Error: ${responseData.detail}`);
      }

      console.log(" Prediction Response:", responseData);
      setPredictionResult(responseData);
    } catch (error) {
      console.error(" Error predicting price:", error);
      alert("Prediction failed. Check the console logs for details.");
    }
    setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!predictionResult) {
      alert("Please generate a prediction first.");
      return;
    }
  
    const recipient = email;  // dynamically from input field
  
    // Correctly structure the prediction_result for backend
    const prediction_result = {
      Make: predictionResult.Make,
      Model: predictionResult.Model,
      "Modification Type": predictionResult["Modification Type"],
      "Selected Car Parts": predictionResult["Selected Car Parts"],
      "Base Price (PHP)": predictionResult["Base Price (PHP)"],
      "Car Parts Cost (PHP)": predictionResult["Car Parts Cost (PHP)"],
      "Current Total Price (PHP)": predictionResult["Current Total Price (PHP)"],
      [`Predicted Price After ${predictionMonths} Months (PHP)`]: predictionResult[`Predicted Price After ${predictionMonths} Months (PHP)`],
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8006/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, prediction_result }),
      });
  
      if (!response.ok) {
        const errorDetail = await response.json();
        alert(`Error sending email: ${errorDetail.detail}`);
      } else {
        const success = await response.json();
        alert(success.message);
        setShowEmailPopup(false); // close popup on success
      }
    } catch (error) {
      console.error("Frontend Error:", error);
      alert("An unexpected error occurred. Please check your backend connection.");
    }
  };
  
  
  
  return (
    <Container>
      <FormContainer>

        <Label>Select Maker:</Label>
        <Select
          onChange={(e) => fetchCarModels(e.target.value)}
          value={selectedMake}
        >
          <option value="">Select Maker</option>
          {carMakers.map((maker) => (
            <option key={maker} value={maker}>
              {maker}
            </option>
          ))}
        </Select>

        <Label>Select Model:</Label>
        <Select
          onChange={(e) => fetchModificationTypes(e.target.value)}
          value={selectedModel}
          disabled={!selectedMake}
        >
          <option value="">Select Model</option>
          {carModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </Select>

        <Label>Select Modification Type:</Label>
        <Select
          onChange={(e) => fetchCarParts(e.target.value)}
          value={selectedModification}
          disabled={!selectedModel}
        >
          <option value="">Select Modification Type</option>
          {modificationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Label>Select Car Parts:</Label>
        <CheckboxGroup>
          {carParts.length > 0 ? (
            carParts.map((part) => (
              <CheckboxLabel key={part}>
                <input
                  type="checkbox"
                  value={part}
                  checked={selectedParts.includes(part)}
                  onChange={() => handleCheckboxChange(part)}
                />
                {part}
              </CheckboxLabel>
            ))
          
          ) : (
            <p style={{ fontSize: "14px", color: "#999" }}>
              No car parts available for this modification type.
            </p>
          )}
        </CheckboxGroup>
      </FormContainer>

      <OutputContainer>
      <Label>Predicted Months:</Label>
        <Input
          type="number"
          value={predictionMonths}
          onChange={(e) => setPredictionMonths(e.target.value)}
          min="1"
          max="60"
        />

        <Button
          onClick={predictPrice}
          disabled={!selectedModification || loading}
        >
          {loading ? "Predicting..." : "Predict Price"}
        </Button>
        <h3>Prediction Output:</h3>
{predictionResult && (
  <div>
    <p><strong>Make:</strong> {predictionResult.Make}</p>
    <p><strong>Model:</strong> {predictionResult.Model}</p>
    <p><strong>Modification Type:</strong> {predictionResult["Modification Type"]}</p>
    <p><strong>Selected Car Parts:</strong> {predictionResult["Selected Car Parts"].join(", ")}</p>
    <p><strong>Car Base Price (PHP):</strong> {predictionResult["Base Price (PHP)"].toLocaleString()}</p>
    <p><strong>Car Parts Cost (PHP):</strong> {predictionResult["Car Parts Cost (PHP)"].toLocaleString()}</p>
    <p><strong>Current Total Price (PHP):</strong> {predictionResult["Current Total Price (PHP)"].toLocaleString()}</p>
    <p><strong>Predicted Price After {predictionMonths} Months (PHP):</strong> {predictionResult[`Predicted Price After ${predictionMonths} Months (PHP)`].toLocaleString()}</p>

    {/* Button to open the email input form */}
    <Button onClick={() => setShowEmailPopup(true)}>
    Send Prediction Email
    </Button>
  </div>
)}

      </OutputContainer>
      {showEmailPopup && (
  <Overlay>
    <EmailPopup>
      <h4>Enter Email Address</h4>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleSendEmail}>Send Email</Button>
      <Button onClick={() => setShowEmailPopup(false)} style={{ background: "#dc3545" }}>
        Cancel
      </Button>

    </EmailPopup>
  </Overlay>
)}

    </Container>
  );
};

export default PredictForm;

//lolomopanot