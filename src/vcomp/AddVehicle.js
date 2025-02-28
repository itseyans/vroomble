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
  width: 950px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 30px;
  border: 4px solid #ffc629;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;

  /* Increase horizontal gap with margin-right,
     and add margin-bottom to provide vertical space when items wrap. */
  & > * {
    margin-right: 50px; /* Increase this value for even wider spacing */
    margin-bottom: 20px; /* Adds vertical gap between wrapped items */
  }

  /* Remove the extra right margin on the last child in each row */
  & > *:last-child {
    margin-right: 0;
  }
`;

const InputsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
`;

const InputField = styled.input`
  width: 230px;
  height: 50px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background: white;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AddVehicle = () => {
  return (
    <Container>
      <Header>🚗 ADD VEHICLE</Header>

      {/* First row of dropdowns */}
      <Row>
        <SelectBrand />
        <SelectFuel />
        <Driveselect />
        <SelectTrans />
      </Row>

      {/* Second row of dropdowns */}
      <Row>
        <SelectYear />
        <SelectBody />
      </Row>

      {/* Model and Retail SRP inputs */}
      <InputsRow>
        <Column>
          <Label>MODEL</Label>
          <InputField placeholder="VIOS" />
        </Column>
        <Column>
          <Label>Retail SRP</Label>
          <InputField placeholder="PHP 1,500,000.00" />
        </Column>
      </InputsRow>

      {/* Add Vehicle button */}
      <ButtonContainer>
        <GeneralButton>ADD VEHICLE</GeneralButton>
      </ButtonContainer>
    </Container>
  );
};

export default AddVehicle;
