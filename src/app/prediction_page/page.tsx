"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import GeneralButton from "@/vcomp/GeneralButton";
import NavBar from "@/vcomp/NavBar";

/** Define API response types */
interface CarMakersResponse {
  makers: string[];
}

interface CarModelsResponse {
  models: string[];
}

interface CarPartsResponse {
  parts: string[];
}

interface PredictionResponse {
  prediction: string;
}

/** Styled Components */
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: white;
`;

const MultiSelectContainer = styled.div`
  width: 100%;
  position: relative;
`;

const PartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PartTag = styled.label`
  display: flex;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const Button = styled(GeneralButton)`
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

/** Main Component */
const PredictForm: React.FC = () => {
  const [carMakers, setCarMakers] = useState<string[]>([]);
  const [selectedMaker, setSelectedMaker] = useState<string>("");
  const [carModels, setCarModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [carParts, setCarParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [months, setMonths] = useState<string>("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /** Fetch car makers on mount */
  useEffect(() => {
    axios
      .get<CarMakersResponse>("http://127.0.0.1:8000/car-makers")
      .then((response) => setCarMakers(response.data.makers || []))
      .catch((error) => console.error("Error fetching car makers:", error));
  }, []);

  /** Fetch car models when car maker is selected */
  useEffect(() => {
    if (selectedMaker) {
      axios
        .get<CarModelsResponse>(`http://127.0.0.1:8000/car-models?make=${selectedMaker}`)
        .then((response) => setCarModels(response.data.models || []))
        .catch((error) => console.error("Error fetching car models:", error));
    } else {
      setCarModels([]);
    }
  }, [selectedMaker]);

  /** Fetch car parts when car model is selected */
  useEffect(() => {
    if (selectedModel) {
      axios
        .get<CarPartsResponse>(`http://127.0.0.1:8000/car-parts?model=${selectedModel}`)
        .then((response) => setCarParts(response.data.parts || []))
        .catch((error) => console.error("Error fetching car parts:", error));
    } else {
      setCarParts([]);
    }
  }, [selectedModel]);

  /** Handle selection of car parts */
  const handlePartSelect = (part: string) => {
    setSelectedParts((prevParts) =>
      prevParts.includes(part)
        ? prevParts.filter((p) => p !== part)
        : [...prevParts, part]
    );
  };

  /** Fetch price prediction */
  const fetchPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModel || selectedParts.length === 0 || !months) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<PredictionResponse>(
        `http://127.0.0.1:8000/predict_price?model=${selectedModel}&parts=${selectedParts.join(
          ","
        )}&months=${months}`
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction");
    }
    setLoading(false);
  };

  return (
    <Container>
      <Header>Car Price Prediction</Header>
      <Form onSubmit={fetchPrediction}>
        {/* Car Maker Dropdown */}
        <Dropdown value={selectedMaker} onChange={(e) => setSelectedMaker(e.target.value)} required>
          <option value="">Select Car Maker</option>
          {carMakers.map((maker, index) => (
            <option key={index} value={maker}>
              {maker}
            </option>
          ))}
        </Dropdown>

        {/* Car Model Dropdown */}
        <Dropdown value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
          <option value="">Select Car Model</option>
          {carModels.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </Dropdown>

        {/* MultiSelect for Car Parts */}
        <MultiSelectContainer>
          <p>Select Car Parts:</p>
          <PartsContainer>
            {carParts.map((part, index) => (
              <PartTag key={index}>
                <Checkbox
                  type="checkbox"
                  value={part}
                  checked={selectedParts.includes(part)}
                  onChange={() => handlePartSelect(part)}
                />
                {part}
              </PartTag>
            ))}
          </PartsContainer>
        </MultiSelectContainer>

        {/* Months Input */}
        <Input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="Enter number of months" required />

        {/* Submit Button */}
        <Button type="submit">Get Prediction</Button>
      </Form>

      {/* Loading and Result */}
      {loading && <p>Loading...</p>}
      {prediction !== null && <Result>Prediction: {prediction}</Result>}
    </Container>
  );
};

const PredictionPage: React.FC = () => (
  <>
    <NavBar />
    <PredictForm />
  </>
);

export default PredictionPage;
