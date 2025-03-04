import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import GeneralButton from './GeneralButton';

const Container = styled.div`
  width: 1373px;
  height: 800px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 10px solid #ffc629;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 65px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  display: flex;
  gap: 80px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Dropdown = styled.select`
  width: 280px;
  height: 50px;
  padding: 12px;
  font-size: 18px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SelectedPartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectedPart = styled.div`
  display: flex;
  align-items: center;
  background: gray;
  padding: 10px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 5px;
`;

const RegisterButton = styled(GeneralButton)`
  width: 320px;
  margin-top: 55px;
`;

export default function PredictionComponent() {
    const [make, setMake] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [part, setPart] = useState('');
    const [selectedParts, setSelectedParts] = useState([]);
    const [month, setMonth] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [makes, setMakes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [parts, setParts] = useState([]);
    const [carModels, setCarModels] = useState([]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    useEffect(() => {
        axios.get('http://localhost:8000/dataset-options')
            .then(response => {
                setMakes(response.data.makes);
                setVehicles(response.data.vehicles);
                setParts(response.data.parts);
            })
            .catch(error => console.error('Error fetching dataset options:', error));
        
        axios.get("http://127.0.0.1:8000/car-models")
            .then(response => setCarModels(response.data.models))
            .catch(error => console.error("Error fetching car models:", error));
    }, []);

    const handleAddPart = () => {
        if (part && !selectedParts.includes(part)) {
            setSelectedParts([...selectedParts, part]);
        }
    };

    const handleRemovePart = (removedPart) => {
        setSelectedParts(selectedParts.filter(p => p !== removedPart));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/predict', {
                make,
                vehicle,
                parts: selectedParts,
                month,
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Prediction error:', error);
            setPrediction('Error fetching prediction');
        }
        setLoading(false);
    };

    return (
        <Container>
            <Header>🚗 Car Maintenance Prediction</Header>
            <ButtonContainer>
                <Dropdown onChange={(e) => setMake(e.target.value)}>
                    <option value="">Select Car Model</option>
                    {carModels.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </Dropdown>
                <GeneralButton>+ Upload Images</GeneralButton>
            </ButtonContainer>
            <FormContainer>
                <Column>
                    <Label>Vehicle Type</Label>
                    <Dropdown value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                        <option value="">Select Vehicle</option>
                        {vehicles.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </Dropdown>

                    <Label>Parts</Label>
                    <Dropdown value={part} onChange={(e) => setPart(e.target.value)}>
                        <option value="">Select Part</option>
                        {parts.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </Dropdown>
                    <GeneralButton onClick={handleAddPart}>Add Part</GeneralButton>
                </Column>
                <Column>
                    <Label>Selected Parts</Label>
                    <SelectedPartsContainer>
                        {selectedParts.map((p) => (
                            <SelectedPart key={p}>{p}
                                <RemoveButton onClick={() => handleRemovePart(p)}>X</RemoveButton>
                            </SelectedPart>
                        ))}
                    </SelectedPartsContainer>
                </Column>
                <Column>
                    <Label>Select Month</Label>
                    <Dropdown value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Select Month</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </Dropdown>
                    <RegisterButton onClick={handleSubmit}>Get Prediction</RegisterButton>
                </Column>
            </FormContainer>
            {loading && <p>Loading...</p>}
            {prediction !== null && <p className="mt-4 font-semibold">Prediction: {prediction}</p>}
        </Container>
    );
}