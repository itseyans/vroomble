"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import Router
import styled from "styled-components";
import CarInfoCard from "@/vcomp/homepage components/CarInfoCard";

// ✅ Main Container for Manage Vehicles
const ManageVehiclesContainer = styled.div`
  background-color: #D9D9D9; /* ✅ Updated Background */
  border: 5px solid #FFC629;
  border-radius: 12px;
  padding: 20px;
  width: 800px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// ✅ Title Section
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  width: 100%;
  margin-bottom: 15px;
  color: black;
`;

// ✅ Buttons
const StyledButton = styled.button`
  background-color: ${({ $color }) => $color || "black"};
  color: ${({ $textColor }) => $textColor || "white"};
  font-weight: bold;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 200px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// ✅ Car List Container
const CarListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  width: 100%;
`;

// ✅ Bottom Button Container
const BottomButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

// ✅ Navigation Arrows
const NavigationContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 2px solid black;
  color: black;
  font-size: 1.5rem;
  padding: 5px 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: #d9d9d9;
  }
`;

const ManageVehiclesCard = () => { 
  const router = useRouter(); // ✅ Initialize Router

  // ✅ List of Cars
  const cars = [
    { carName: "LEXUS LC 500", totalSpent: "2500", imageUrl: "/lexus-lc500.png" },
    { carName: "LB HURACAN STO", totalSpent: "12500", imageUrl: "/huracan-sto.png" },
  ];

  // ✅ State for Current Car Index
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Handle Navigation
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cars.length) % cars.length);
  };

  return (
    <ManageVehiclesContainer>
      {/* ✅ Title Section */}
      <TitleContainer>
        <span>MANAGE VEHICLES</span>
        <StyledButton $color="black" $textColor="gold">VIEW ALL</StyledButton>
      </TitleContainer>

      {/* ✅ Car Info (Dynamic Based on Current Index) */}
      <CarListContainer>
        <CarInfoCard 
          carName={cars[currentIndex].carName} 
          totalSpent={cars[currentIndex].totalSpent}
          imageUrl={cars[currentIndex].imageUrl} 
        />
      </CarListContainer>

      {/* ✅ Bottom Buttons & Navigation */}
      <BottomButtonsContainer>
        {/* ✅ Redirects to User Vehicle Registration */}
        <StyledButton 
          $color="black" 
          $textColor="gold"
          onClick={() => router.push("/user_vehicle_registration")} 
        >
          + ADD VEHICLE
        </StyledButton>

        {/* ✅ Navigation Arrows */}
        <NavigationContainer>
          <NavButton onClick={handlePrev}>←</NavButton>
          <NavButton onClick={handleNext}>→</NavButton>
        </NavigationContainer>

        <StyledButton $color="black" $textColor="gold">LIST VEHICLE</StyledButton>
      </BottomButtonsContainer>
    </ManageVehiclesContainer>
  );
};

export default ManageVehiclesCard;
