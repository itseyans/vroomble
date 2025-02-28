import React from "react";
import styled from "styled-components";
import SelectBrand from "./SelectBrand";
import SelectFuel from "./SelectFuel";
import Driveselect from "./Driveselect";
import SelectTrans from "./SelectTrans";
import SelectBody from "./SelectBody";
import GeneralButton from "./GeneralButton";
import SelectYear from "./SelectYear";

const Container = styled.div`
  width: 950px; /* Adjusted width for better spacing */
  height: auto;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4px solid #ffc629;
  gap: 25px; /* Adjusted spacing */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  align-self: center;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 15px; /* Adjusted spacing between dropdowns */
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px; /* Adjusted gap for better alignment */
  width: 100%;
  margin-bottom: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const InputField = styled.input`
  width: 230px; /* Slightly increased width */
  height: 50px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background: white;
  text-align: center;
`;

const Label = styled.label`
  font-size: 18px; /* Increased label size */
  font-weight: bold;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`;

const AddVehicle = () => {
  return (
    <Container>
      <Header>🚗 ADD VEHICLE</Header>
      <DropdownContainer>
        <SelectBrand />
        <SelectFuel />
        <Driveselect />
        <SelectTrans />
      </DropdownContainer>
      <DropdownContainer>
        <SelectYear />
        <SelectBody />
      </DropdownContainer>
      <InputContainer>
        <Column>
          <Label>MODEL</Label>
          <InputField placeholder="VIOS" />
        </Column>
        <Column>
          <Label>Retail SRP</Label>
          <InputField placeholder="PHP 1,500,000.00" />
        </Column>
      </InputContainer>
      <ButtonContainer>
        <GeneralButton>ADD VEHICLE</GeneralButton>
      </ButtonContainer>
    </Container>
  );
};

export default AddVehicle;
