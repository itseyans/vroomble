"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GeneralNavBar from "@/vcomp/GeneralNavBar";
import FilterListings from "@/vcomp/listingspage components/FilterListings";
import ListingCard from "@/vcomp/ListingCard";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  padding-top: 9rem;
`;

const FilterListingsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const VehicleGridContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 20px;
  width: 90%;
  max-width: 1200px;
  justify-content: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #ffc629;
  color: black;
  font-weight: bold;
  padding: 15px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function VehicleListing() {
  const [vehicles, setVehicles] = useState<
    { UserRV_ID: number; imageUrl: string; carName: string; dateListed: string }[]
  >([]);

  useEffect(() => {
    async function fetchListedVehicles() {
      try {
        const response = await fetch("http://localhost:8004/api/listed-vehicles/");
        if (!response.ok) throw new Error("Failed to fetch vehicles");
  
        const data = await response.json();
        console.log("Vehicle Data:", data);
        console.log("First Vehicle Entry:", data.listed_vehicles[0]);
  
        if (!data.listed_vehicles || data.listed_vehicles.length === 0) {
          setVehicles([]);
          return;
        }
  
        const vehiclesWithImages = await Promise.all(
          data.listed_vehicles.map(async (vehicle: any) => {
            // ✅ Convert raw array into an object
            const formattedVehicle = {
              UserRV_ID: vehicle[0],  // Assuming first index is the ID
              Color: vehicle[4] || "Unknown",
              Trim: vehicle[2] || "Model",
              PlateEnd: vehicle[3] || "N/A",
            };
  
            if (!formattedVehicle.UserRV_ID) {
              console.error("Missing UserRV_ID for vehicle:", vehicle);
              return null; // Skip invalid entries
            }
  
            try {
              const imageResponse = await fetch(`http://localhost:8004/api/vehicle-images/${formattedVehicle.UserRV_ID}`);
              if (!imageResponse.ok) throw new Error("Image fetch failed");
  
              const imageData = await imageResponse.json();
              console.log("Image Data for", formattedVehicle.UserRV_ID, ":", imageData);
  
              return {
                UserRV_ID: formattedVehicle.UserRV_ID,
                imageUrl: imageData.images?.[0]
                  ? `http://localhost:8004/car_images/${imageData.images[0]}`
                  : "", // No placeholder
                carName: `${formattedVehicle.Color} ${formattedVehicle.Trim} (Plate: ${formattedVehicle.PlateEnd})`,
                dateListed: "Recently Listed",
              };
            } catch (err) {
              console.error("Error fetching images for ID:", formattedVehicle.UserRV_ID, err);
              return {
                UserRV_ID: formattedVehicle.UserRV_ID,
                imageUrl: "", // No fallback image
                carName: `${formattedVehicle.Color} ${formattedVehicle.Trim} (Plate: ${formattedVehicle.PlateEnd})`,
                dateListed: "Recently Listed",
              };
            }
          })
        );
  
        setVehicles(vehiclesWithImages.filter((v) => v !== null));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
  
    fetchListedVehicles();
  }, []);   

  return (
    <PageContainer>
      <GeneralNavBar />
      <FilterListingsWrapper>
        <FilterListings />
      </FilterListingsWrapper>

      <VehicleGridContainer>
        <VehicleGrid>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <ListingCard
                key={vehicle.UserRV_ID}
                imageUrl={vehicle.imageUrl}
                carName={vehicle.carName}
                dateListed={vehicle.dateListed}
              />
            ))
          ) : (
            <p>No listed vehicles available</p>
          )}
        </VehicleGrid>
      </VehicleGridContainer>

      <PaginationContainer>
        <PaginationButton>⬅</PaginationButton>
        <PaginationButton>➡</PaginationButton>
      </PaginationContainer>
    </PageContainer>
  );
}
