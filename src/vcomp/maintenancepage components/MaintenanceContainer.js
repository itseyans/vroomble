import React from "react";
import styled from "styled-components";
import CarDetails from "@/vcomp/CarDetails";
import EngineTireInputs from "@/vcomp/maintenancepage components/EngineTireInputs.js";
import Changes from "@/vcomp/maintenancepage components/Changes.js";
import MaintenanceLogs from "@/vcomp/MaintenanceLogs.js";

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.6fr 1fr; // Reduced middle column width
  grid-template-rows: minmax(0, 1fr);
  gap: 50px;
  padding: 20px;
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 10px;
  margin: 5px auto;
  width: 100%;
  max-width: 1500px;
`;

const CarDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px; // Reduced padding
`;

const EngineTireWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px; // Reduced margin
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