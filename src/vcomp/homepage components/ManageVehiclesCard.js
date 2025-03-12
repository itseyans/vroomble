"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import styled from "styled-components";
import CarInfoCard from "@/vcomp/homepage components/CarInfoCard";

// ✅ Styled Components (Same as Before)
const ManageVehiclesContainer = styled.div`
  background-color: #D9D9D9;
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

const CarListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  width: 100%;
`;

const BottomButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

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

const VehicleCount = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
`;

// ✅ Manage Vehicles Component
const ManageVehiclesCard = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0); // ✅ Vehicle count state

useEffect(() => {
  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://localhost:8004/api/user-vehicles/", {
        credentials: "include", // ✅ Ensures cookies are sent
      });
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Error: Expected array but got:", data);
        return;
      }

      const vehicleDetails = await Promise.all(
        data.map(async (vehicle) => {
          console.log("🔍 Fetching vehicle details for usersRV_ID:", vehicle.usersRV_ID);

          const imageResponse = await fetch(`http://localhost:8004/api/vehicle-images/${vehicle.usersRV_ID}`);
          const imageData = await imageResponse.json();

          return {
            usersRV_ID: vehicle.usersRV_ID,
            carName: vehicle.carName,
            totalSpent: "0",
            imageUrl: imageData.images.length > 0
              ? `http://localhost:8004/car_images/${imageData.images[0]}`
              : "/default-placeholder.png", // ✅ Use placeholder if no image
          };
        })
      );

      console.log("🚘 Processed Vehicles:", vehicleDetails);
      setVehicles(vehicleDetails.filter((v) => v !== null)); // Remove null values
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  fetchVehicles();
}, []);



  // ✅ Fetch vehicle count on component mount
useEffect(() => {
  const fetchVehicleCount = async () => {
    try {
      const response = await fetch("http://localhost:8004/user/vehicle-count", {
        credentials: "include", // ✅ Ensure cookies are sent
      });
      const data = await response.json();

      if (response.ok) {
        setVehicleCount(data.vehicle_count);
      } else {
        console.error("Failed to fetch vehicle count:", data);
      }
    } catch (error) {
      console.error("Error fetching vehicle count:", error);
    }
  };

  fetchVehicleCount();
}, []);


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length);
  };

  return (
    <ManageVehiclesContainer>
      <TitleContainer>
        <span>MANAGE VEHICLES</span>
        <StyledButton $color="black" $textColor="gold">VIEW ALL</StyledButton>
      </TitleContainer>


      {vehicles.length > 0 ? (
        <CarListContainer>
          <CarInfoCard 
            carName={vehicles[currentIndex].carName} 
            totalSpent={vehicles[currentIndex].totalSpent}
            imageUrl={vehicles[currentIndex].imageUrl} 
          />
        </CarListContainer>
      ) : (
        <p>No registered vehicles found.</p>
      )}

      <BottomButtonsContainer>
        <StyledButton 
          $color="black" 
          $textColor="gold"
          onClick={() => router.push("/user_vehicle_registration")} 
        >
          + ADD VEHICLE
        </StyledButton>

        <NavigationContainer>
          <NavButton onClick={handlePrev} disabled={vehicles.length === 0}>←</NavButton>
          <NavButton onClick={handleNext} disabled={vehicles.length === 0}>→</NavButton>
        </NavigationContainer>

        <StyledButton $color="black" $textColor="gold">LIST VEHICLE</StyledButton>
      </BottomButtonsContainer>
    </ManageVehiclesContainer>
  );
};

export default ManageVehiclesCard;
