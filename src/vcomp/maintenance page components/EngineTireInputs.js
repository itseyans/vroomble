import React, { useState } from "react";
import styled from "styled-components";
import SelectDate from "../SelectDate"; // Import your DatePicker component

const InputsContainer = styled.div`
  display: flex;
  justify-content: space-between; // Distribute space evenly
  margin: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%; // Adjust as needed to fit side-by-side
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 5px;
`;

const EngineTireInputs = () => {
  const [engineValue, setEngineValue] = useState("");
  const [tireValue, setTireValue] = useState("");
  const [engineDate, setEngineDate] = useState(new Date());
  const [tireDate, setTireDate] = useState(new Date());
  const [isEngineCalendarOpen, setIsEngineCalendarOpen] = useState(false);
  const [isTireCalendarOpen, setIsTireCalendarOpen] = useState(false);

  return (
    <InputsContainer>
      {/* FORM for engine*/}
      <InputContainer>
        <Label>Engine</Label>
        <Input
          type="text"
          value={engineValue}
          onChange={(e) => setEngineValue(e.target.value)}
          placeholder="Value"
        />
        <SelectDate
          onChange={setEngineDate}
          isCalendarOpen={isEngineCalendarOpen}
          setIsCalendarOpen={setIsEngineCalendarOpen}
        />
      </InputContainer>

      {/* FORM for Tires*/}
      <InputContainer>
        <Label>Tire</Label>
        <Input
          type="text"
          value={tireValue}
          onChange={(e) => setTireValue(e.target.value)}
          placeholder="Value"
        />
        <SelectDate
          onChange={setTireDate}
          isCalendarOpen={isTireCalendarOpen}
          setIsCalendarOpen={setIsTireCalendarOpen}
        />
      </InputContainer>
    </InputsContainer>
  );
};

export default EngineTireInputs;