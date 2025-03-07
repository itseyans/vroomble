import React from "react";
import styled from "styled-components";
import CarDetails from "./CarDeets";
import EngineTireInputs from "./EngineAndTire";
import Changes from "./PartsAndCostWithDatePicker";
import MaintenanceLogs from "./Logs";

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.6fr 1fr; // Reduced middle column width
  grid-template-rows: minmax(0, 1fr);
  gap: 2px;
  padding: 2px;
  background-color: #f8f8f8;
  border: 5px solid #ffc629;
  border-radius: 10px;
  margin: 2px auto;
  width: 98%;
  max-width: 1000px;
`;

const CarDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1px; // Reduced padding
`;

const EngineTireWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1px; // Reduced margin
`;

const MaintenancePage = () => {
  return (
    <MainContainer>
      <MaintenanceLogs style={{ maxHeight: "150px", overflowY: "auto" }} />
      <CarDetailsWrapper>
        <CarDetails />
        <EngineTireWrapper>
          <EngineTireInputs />
        </EngineTireWrapper>
      </CarDetailsWrapper>
      <Changes style={{ maxHeight: "150px", overflowY: "auto" }} />
    </MainContainer>
  );
};

export default MaintenancePage;