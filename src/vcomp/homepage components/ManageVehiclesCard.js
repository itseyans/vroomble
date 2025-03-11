"use client";

import React from "react";
import styled from "styled-components";
import CarInfoM from "@/vcomp/CarInfoM"; // ✅ Import individual car info component

// ✅ Main Container for Manage Vehicles
const ManageVehiclesContainer = styled.div`
  background-color: #F4F4F5; /* ✅ Light gray background */
  border: 5px solid #FFC629; /* ✅ Yellow border */
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
`;

// ✅ Title Section
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

// ✅ View All Button
const ViewAllButton = styled.button`
  background-color: black;
  color: gold;
  font-weight: bold;
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #312F17;
    transform: scale(1.05);
  }
`;

// ✅ Car List Container
const CarListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// ✅ Bottom Button Container
const BottomButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// ✅ Action Buttons (List & Add Vehicle)
const ActionButton = styled.button`
  background-color: ${({ color }) => color || "black"};
  color: ${({ textColor }) => textColor || "white"};
  font-weight: bold;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ManageVehiclesCard = () => {
  return (
    <ManageVehiclesContainer>
      {/* ✅ Title Section */}
      <TitleContainer>
        <span>MANAGE VEHICLES</span>
        <ViewAllButton>VIEW ALL</ViewAllButton>
      </TitleContainer>

      {/* ✅ Car List */}
      <CarListContainer>
        <CarInfoM carName="LEXUS LC 500" totalSpent="₱2500" />
        <CarInfoM carName="LB HURACAN STO" totalSpent="₱12500" />
      </CarListContainer>

      {/* ✅ Bottom Buttons */}
      <BottomButtonsContainer>
        <ActionButton color="black" textColor="gold">+ LIST VEHICLE</ActionButton>
        <ActionButton color="black" textColor="gold">+ ADD VEHICLE</ActionButton>
      </BottomButtonsContainer>
    </ManageVehiclesContainer>
  );
};

export default ManageVehiclesCard;
