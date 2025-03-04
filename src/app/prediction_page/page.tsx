import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import GeneralButton from '@/components/GeneralButton';
import Navbar from 'C:\Users\HP\Documents\GitHub\vroomble\src\vcomp';

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
    const [carModels, setCarModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/car-models")
            .then(response => setCarModels(response.data.models))
            .catch(error => console.error("Error fetching car models:", error));
    }, []);

    const fetchPrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/predict_price?model=${selectedModel}&months=12`);
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
                <Dropdown value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
                    <option value="">Select a Car Model</option>
                    {carModels.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </Dropdown>
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
            <Navbar />
            <PredictForm />
        </>
    );
};

export default PredictionPage;
