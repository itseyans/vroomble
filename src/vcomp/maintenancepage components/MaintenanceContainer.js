import React, { useState } from "react";
import styled from "styled-components";
import CarDetails from "@/vcomp/CarDetails";
import EngineTireInputs from "@/vcomp/maintenancepage components/EngineTireInputs.js";
import Changes from "@/vcomp/maintenancepage components/Changes.js";
import MaintenanceLogs from "@/vcomp/MaintenanceLogs.js";

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.6fr 1fr;
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
  padding: 5px;
`;

const EngineTireWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;

const MaintenanceContainer = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null); // ✅ Ensure useState is properly imported

  return (
    <MainContainer>
      <MaintenanceLogs style={{ maxHeight: "250px", overflowY: "auto" }} />
      <CarDetailsWrapper>
        {/* ✅ Pass `setSelectedVehicle` to `CarDetails.js` */}
        <CarDetails onVehicleSelect={setSelectedVehicle} />
        <EngineTireWrapper>
          <EngineTireInputs />
        </EngineTireWrapper>
      </CarDetailsWrapper>
      {/* ✅ Pass `selectedVehicle` to `Changes.js` */}
      <Changes selectedVehicle={selectedVehicle} style={{ maxHeight: "250px", overflowY: "auto" }} />
    </MainContainer>
  );
};

export default MaintenanceContainer;
