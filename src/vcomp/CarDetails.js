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
  margin: 0;
  font-size: 2em;
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

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarImage = styled.img`
  width: 100%;
  display: block;
`;

const DetailsBox = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

const Button = styled.button`
  background-color: #ffc629;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1em;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background-color: white;
  }
`;

const ArrowButton = styled.button`
  background-color: #ffc629;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 1.5em;
  border-radius: 5px;
  transition: background 0.3s;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    background-color: white;
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 10px;
`;

const NextButton = styled(ArrowButton)`
  right: 10px;
`;

const CarDetails = ({ onVehicleSelect }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
              images: imageData.images.length > 0
                ? imageData.images.map(img => `http://localhost:8004/car_images/${img}`)
                : ["/default-placeholder.png"],
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
    setCurrentImageIndex(0);
    onVehicleSelect(selected);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedVehicle.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedVehicle.images.length) % selectedVehicle.images.length);
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

      <ImageContainer>
        <PrevButton onClick={handlePrevImage}>◀</PrevButton>
        <CarImage src={selectedVehicle?.images[currentImageIndex]} alt={selectedVehicle?.carName || "Car Image"} />
        <NextButton onClick={handleNextImage}>▶</NextButton>
      </ImageContainer>

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
        <Button>Add Image</Button>
      </DetailsBox>
    </CarDetailsContainer>
  );
};

export default CarDetails;
