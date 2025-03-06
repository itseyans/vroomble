import React from "react";
import styled from "styled-components";
import VehicleDropdown from "./VehicleSelect"; // Vehicle selection dropdown
import GeneralButton from "./GeneralButton"; // Buttons for Upload & Register

const Container = styled.div`
  width: 1373px;
  height: 800px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center everything horizontally */
  justify-content: center; /* Center everything vertically */
  border: 10px solid #ffc629; /* 2px Yellow Stroke */
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
  gap: 65px; /* Adjusted spacing for perfect alignment */
  align-items: center;
  justify-content: center; /* Center the buttons */
  width: 100%;
  margin-bottom: 30px; /* More spacing below buttons */
`;

const FormContainer = styled.div`
  display: flex;
  gap: 80px;
  justify-content: center; /* Center the form content */
  align-items: flex-start;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.input`
  width: 280px;
  height: 50px;
  padding: 12px;
  font-size: 18px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
`;

const TextArea = styled.textarea`
  width: 320px;
  height: 173px;
  padding: 22px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const RegisterButton = styled(GeneralButton)`
  width: 320px;
  margin-top: 55px; /* Ensure proper spacing from text area */
`;

const RegisterVehicle = () => {
  return (
    <Container>
      <Header>🚗 REGISTER VEHICLE</Header>

      {/* Dropdown + Upload Image (Now centered properly) */}
      <ButtonContainer>
        <VehicleDropdown />
        <GeneralButton>+ Upload Images</GeneralButton>
      </ButtonContainer>

      {/* Form Fields */}
      <FormContainer>
        {/* Left Column */}
        <Column>
          <Label>Plate End (3)</Label>
          <InputField placeholder="888" />

          <Label>Mileage</Label>
          <InputField placeholder="12345 KM" />

          <Label>Color</Label>
          <InputField placeholder="Blue" />
        </Column>

        {/* Right Column */}
        <Column>
          <Label>Accident History</Label>
          <InputField placeholder="None" />

          <Label>Condition</Label>
          <InputField placeholder="NEW" />

          <RegisterButton>REGISTER VEHICLE</RegisterButton>
        </Column>
      </FormContainer>
    </Container>
  );
};

export default RegisterVehicle;
