import React from "react";
import styled from "styled-components";
import CarDetails from "../vcomp/CarDetails";
import EngineTireInputs from "../vcomp/EngineTireInputs";
import Changes from "../vcomp/Changes";
import MaintenanceLogs from "./MaintenanceLogs";

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.6fr 1fr; // Reduced middle column width
  grid-template-rows: minmax(0, 1fr);
  gap: 2px;
  padding: 5px;
  background-color: #f8f8f8;
  border: 5px solid #ffc629;
  border-radius: 10px;
  margin: 2px auto;
  width: 100%;
  max-width: 1350px;
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
      <MaintenanceLogs style={{ maxHeight: "250px", overflowY: "auto" }} />
      <CarDetailsWrapper>
        <CarDetails />
        <EngineTireWrapper>
          <EngineTireInputs />
        </EngineTireWrapper>
      </CarDetailsWrapper>
      <Changes style={{ maxHeight: "250px", overflowY: "auto" }} />
    </MainContainer>
  );
};

export default MaintenancePage;