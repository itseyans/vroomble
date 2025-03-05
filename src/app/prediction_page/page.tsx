"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import GeneralButton from '@/vcomp/GeneralButton';
import NavBar from '@/vcomp/NavBar';

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

const MultiSelectDropdown = styled.div`
  width: 100%;
  position: relative;
`;

const SelectedParts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const PartTag = styled.span`
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
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

const PredictForm = () => {
    const [carMakers, setCarMakers] = useState([]);
    const [selectedMaker, setSelectedMaker] = useState('');
    const [carModels, setCarModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [carParts, setCarParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [months, setMonths] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/car-makers")
            .then(response => setCarMakers(response.data.makers || []))
            .catch(error => console.error("Error fetching car makers:", error));
    }, []);

    useEffect(() => {
        if (selectedMaker) {
            axios.get(`http://127.0.0.1:8000/car-models?make=${selectedMaker}`)
                .then(response => setCarModels(response.data.models || []))
                .catch(error => console.error("Error fetching car models:", error));
        }
    }, [selectedMaker]);

    useEffect(() => {
        if (selectedModel) {
            axios.get(`http://127.0.0.1:8000/car-parts?model=${selectedModel}`)
                .then(response => setCarParts(response.data.parts || []))
                .catch(error => console.error("Error fetching car parts:", error));
        }
    }, [selectedModel]);

    const handlePartSelect = (part) => {
        setSelectedParts((prevParts) =>
            prevParts.includes(part) ? prevParts.filter(p => p !== part) : [...prevParts, part]
        );
    };

    const fetchPrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/predict_price?model=${selectedModel}&parts=${selectedParts.join(",")}&months=${months}`
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
                <Dropdown value={selectedMaker} onChange={(e) => setSelectedMaker(e.target.value)} required>
                    <option value="">Select Car Maker</option>
                    {carMakers.map((maker, index) => (
                        <option key={index} value={maker}>{maker}</option>
                    ))}
                </Dropdown>

                <Dropdown value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
                    <option value="">Select Car Model</option>
                    {carModels.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </Dropdown>

                <MultiSelectDropdown>
                    <Dropdown>
                        <option>Select Car Parts</option>
                    </Dropdown>
                    <SelectedParts>
                        {carParts.map((part, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={part}
                                    checked={selectedParts.includes(part)}
                                    onChange={() => handlePartSelect(part)}
                                />
                                {part}
                            </label>
                        ))}
                    </SelectedParts>
                </MultiSelectDropdown>

                <Input 
                    type="number" 
                    value={months} 
                    onChange={(e) => setMonths(e.target.value)} 
                    placeholder="Enter number of months"
                    required
                />

                <Button type="submit">Get Prediction</Button>
            </Form>
            {loading && <p>Loading...</p>}
            {prediction !== null && <Result>Prediction: {prediction}</Result>}
        </Container>
    );
};

const PredictionPage = () => {
    return (
        <>
            <NavBar />
            <PredictForm />
        </>
    );
};

export default PredictionPage;