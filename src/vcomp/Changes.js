import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "./DatePicker";
import GeneralButton from "./GeneralButton.js";

const FormContainer = styled.div`
  width: 240px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const LInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;

const UploadButton = styled(GeneralButton)`
  background-color: #e0e0e0;
  padding: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  width: 225px;
`;

const SubmitButton = styled(GeneralButton)`
  margin-top: 10px;
  width: 300px;
  display: ${(props) => (props.isCalendarOpen ? "none" : "block")};
`;

const PartsAndCostWithDatePicker = () => {
  const [part, setPart] = useState("");
  const [cost, setCost] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Part:", part);
    console.log("Cost:", cost);
    console.log("Date:", selectedDate);
  };

  return (
    <FormContainer>
      <Title>+ Add Changes</Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <StyledLabel>PART</StyledLabel>
          <LInput
            type="text"
            value={part}
            onChange={(e) => setPart(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <StyledLabel>COST</StyledLabel>
          <LInput
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </InputGroup>
        <CenteredContainer>
          <UploadButton>+ UPLOAD IMAGES</UploadButton>
          <DatePicker
            onChange={setSelectedDate}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
          />
          <SubmitButton type="submit" isCalendarOpen={isCalendarOpen}>
            + SUBMIT CHANGES
          </SubmitButton>
        </CenteredContainer>
      </form>
    </FormContainer>
  );
};

export default PartsAndCostWithDatePicker;