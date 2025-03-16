"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Components
const CarDetailsContainer = styled.div`
  font-family: sans-serif;
  width: 600px;
  margin: 10px auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleContainer = styled.div`
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
  padding: 10px;
  font-size: 1.5em;
  font-weight: bold;
  text-transform: uppercase;
`;

const CarSelect = styled.select`
  font-size: 1em;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CarImage = styled.img`
  width: 100%;
  display: block;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;

  ${({ left }) => (left ? "left: 10px;" : "right: 10px;")}
`;

const DetailsBox = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  border: 2px solid black;
  border-radius: 0 0 10px 10px;
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DetailItem = styled.div`
  font-size: 1.2em;
  color: #555;
`;

const CarDetails = ({ onVehicleSelect }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8004/api/user-vehicles/", {
          credentials: "include",
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Error: Expected array but got:", data);
          return;
        }

        const vehicleDetails = await Promise.all(
          data.map(async (vehicle) => {
            const imageResponse = await fetch(`http://localhost:8004/api/vehicle-images/${vehicle.usersRV_ID}`);
            const imageData = await imageResponse.json();

            const detailsResponse = await fetch(`http://localhost:8004/api/vehicle-details/${vehicle.usersRV_ID}`);
            const detailsData = await detailsResponse.json();

            return {
              usersRV_ID: vehicle.usersRV_ID,
              carName: vehicle.carName,
              year: detailsData.year,
              images: imageData.images.length > 0 ? imageData.images : ["/default-placeholder.png"],
              make: detailsData.make,
              model: detailsData.model,
              variant: detailsData.variant,
              color: detailsData.color,
              trim: detailsData.trim,
              mileage: detailsData.mileage,
              plateEnd: detailsData.plateEnd,
            };
          })
        );

        setVehicles(vehicleDetails);

        if (vehicleDetails.length > 0) {
          setSelectedVehicle(vehicleDetails[0]);
          onVehicleSelect(vehicleDetails[0]);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [onVehicleSelect]);

  const handleVehicleChange = (event) => {
    const vehicleId = parseInt(event.target.value, 10);
    const selected = vehicles.find((v) => v.usersRV_ID === vehicleId);
    setSelectedVehicle(selected);
    setImageIndex(0);
    onVehicleSelect(selected);
  };

  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedVehicle.images.length);
  };

  const prevImage = () => {
    setImageIndex((prevIndex) => (prevIndex - 1 + selectedVehicle.images.length) % selectedVehicle.images.length);
  };

  return (
    <CarDetailsContainer>
      <TitleContainer>
        <CarSelect onChange={handleVehicleChange} value={selectedVehicle?.usersRV_ID || ""}>
          {vehicles.map((vehicle) => (
            <option key={vehicle.usersRV_ID} value={vehicle.usersRV_ID}>
              {vehicle.carName}
            </option>
          ))}
        </CarSelect>
      </TitleContainer>

      <CarouselContainer>
        <NavButton left onClick={prevImage}>&lt;</NavButton>
        <CarImage 
          src={`http://localhost:8004/car_images/${selectedVehicle?.images[imageIndex]}`} 
          alt={selectedVehicle?.carName || "Car Image"} 
          onError={(e) => e.target.src = "/default-placeholder.png"}
        />
        <NavButton onClick={nextImage}>&gt;</NavButton>
      </CarouselContainer>

      <DetailsBox>
        <DetailColumn>
          <DetailItem>{selectedVehicle?.make || "Unknown Make"}</DetailItem>
          <DetailItem>{selectedVehicle?.model || "Unknown Model"}</DetailItem>
          <DetailItem>{selectedVehicle?.variant || "N/A Variant"}</DetailItem>
          <DetailItem>{selectedVehicle?.year || "N/A"} Model</DetailItem>
        </DetailColumn>
        <DetailColumn>
          <DetailItem>Color: {selectedVehicle?.color || "N/A"}</DetailItem>
          <DetailItem>Trim: {selectedVehicle?.trim || "N/A"}</DetailItem>
          <DetailItem>Mileage: {selectedVehicle?.mileage || "N/A"} km</DetailItem>
          <DetailItem>Plate End: {selectedVehicle?.plateEnd || "N/A"}</DetailItem>
        </DetailColumn>
      </DetailsBox>
    </CarDetailsContainer>
  );
};

export default CarDetails;
