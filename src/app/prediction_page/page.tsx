"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Background from "../../vcomp/background";
import NavBar from "../../vcomp/NavBar";
import GeneralButton from "../../vcomp/GeneralButton";

/** Styled Components */
const Container = styled.div`
  width: 450px;
  height: auto;
  background: #ddd;
  border-radius: 20px;
  margin: auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Dropdown = styled.select`
  padding: 10px;
  border-radius: 8px;
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 8px;
`;

export default function Page() {
  const [makers, setMakers] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modificationTypes, setModificationTypes] = useState<string[]>([]);
  const [carParts, setCarParts] = useState<string[]>([]);

  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modificationType, setModificationType] = useState("");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [months, setMonths] = useState(12);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /** Fetch Car Makers */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/car-makers")
      .then((res) => res.json())
      .then((data) => setMakers(data.makers))
      .catch((err) => console.error("Error fetching makers:", err));
  }, []);

  /** Fetch Models when Maker is selected */
  useEffect(() => {
    if (!selectedMaker) return;
    fetch(`http://127.0.0.1:8000/car-models?make=${selectedMaker}`)
      .then((res) => res.json())
      .then((data) => setModels(data.models))
      .catch((err) => console.error("Error fetching models:", err));
  }, [selectedMaker]);

  /** Fetch Modification Types and Car Parts when Model is selected */
  useEffect(() => {
    if (!selectedModel) return;
    fetch(`http://127.0.0.1:8000/modification-types?model=${selectedModel}`)
      .then((res) => res.json())
      .then((data) => setModificationTypes(data.modification_types))
      .catch((err) => console.error("Error fetching modifications:", err));

    fetch(`http://127.0.0.1:8000/car-parts?model=${selectedModel}`)
      .then((res) => res.json())
      .then((data) => setCarParts(data.parts))
      .catch((err) => console.error("Error fetching car parts:", err));
  }, [selectedModel]);

  /** Fetch Prediction */
  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          make: selectedMaker,
          model_name: selectedModel,
          modification_type: modificationType,
          selected_parts: selectedParts,
          months: parseInt(months.toString()),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      setPrediction(data);
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Failed to fetch prediction.");
    }
    setLoading(false);
  };

  return (
    <>
      <Background />
      <NavBar />
      <Container>
        <Title>Car Price Prediction</Title>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPrediction();
          }}
        >
          <Dropdown
            required
            value={selectedMaker}
            onChange={(e) => setSelectedMaker(e.target.value)}
          >
            <option value="">Select Maker</option>
            {makers.map((maker, idx) => (
              <option key={idx} value={maker}>
                {maker}
              </option>
            ))}
          </Dropdown>

          <Dropdown
            required
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((model, idx) => (
              <option key={idx} value={model}>
                {model}
              </option>
            ))}
          </Dropdown>

          <Dropdown
            required
            value={modificationType}
            onChange={(e) => setModificationType(e.target.value)}
          >
            <option value="">Select Modification Type</option>
            {modificationTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </Dropdown>

          <div>
            {carParts.map((part, idx) => (
              <label key={idx} style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  value={part}
                  checked={selectedParts.includes(part)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedParts((prevParts) =>
                      checked ? [...prevParts, part] : prevParts.filter((p) => p !== part)
                    );
                  }}
                />
                {part}
              </label>
            ))}
          </div>

          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            placeholder="Enter Months"
            required
            style={{ padding: "10px", borderRadius: "8px", marginTop: "10px" }}
          />

          <GeneralButton type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Price"}
          </GeneralButton>
        </Form>

        {prediction && (
          <ResultBox>
            <p>
              <strong>Make:</strong> {prediction.Make}
            </p>
            <p>
              <strong>Model:</strong> {prediction.Model}
            </p>
            <p>
              <strong>Modification Type:</strong> {prediction["Modification Type"]}
            </p>
            <p>
              <strong>Selected Car Parts:</strong>{" "}
              {Array.isArray(prediction["Selected Car Parts"])
                ? prediction["Selected Car Parts"].join(", ")
                : "None"}
            </p>
            <p>
              <strong>Base Price (PHP):</strong> {prediction["Base Price (PHP)"]}
            </p>
            <p>
              <strong>Car Parts Cost (PHP):</strong> {prediction["Car Parts Cost (PHP)"]}
            </p>
            <p>
              <strong>Current Total Price (PHP):</strong>{" "}
              {prediction["Current Total Price (PHP)"]}
            </p>
            <p>
              <strong>Predicted Price After {months} Months (PHP):</strong>{" "}
              {prediction[`Predicted Price After ${months} Months (PHP)`]}
            </p>
          </ResultBox>
        )}
      </Container>
    </>
  );
}
