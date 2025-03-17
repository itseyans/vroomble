"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddImage from "./AddImage";
import HoverZoom from "./HoverZoom";


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
  const [vehicleImages, setVehicleImages] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [hovered, setHovered] = useState(false);
const [position, setPosition] = useState({ x: 50, y: 50 });


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

            const images = imageData.images.length > 0
              ? imageData.images.map(img => `http://localhost:8004/car_images/${img}`)
              : ["/default-placeholder.png"];

            return {
              usersRV_ID: vehicle.usersRV_ID,
              carName: vehicle.carName,
              year: detailsData.year,
              images: images,
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

        // Store images for each vehicle
        const imagesMap = vehicleDetails.reduce((acc, vehicle) => {
          acc[vehicle.usersRV_ID] = vehicle.images;
          return acc;
        }, {});

        setVehicles(vehicleDetails);
        setVehicleImages(imagesMap);

        if (vehicleDetails.length > 0) {
          setSelectedVehicle(vehicleDetails[0]);
          setCurrentImageIndex({ [vehicleDetails[0].usersRV_ID]: 0 });
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

    if (!selected) return; 

    setSelectedVehicle(selected);
    setCurrentImageIndex({ [vehicleId]: 0 });
    onVehicleSelect(selected);
  };

  const handleNextImage = () => {
    if (!selectedVehicle) return;

    const vehicleId = selectedVehicle.usersRV_ID;
    const images = vehicleImages[vehicleId] || [];

    if (images.length === 0) return;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] + 1) % images.length,
    }));
  };

  const handleMouseMove = (e) => {
  const { left, top, width, height } = e.target.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  setPosition({ x, y });
};


  const handlePrevImage = () => {
    if (!selectedVehicle) return;

    const vehicleId = selectedVehicle.usersRV_ID;
    const images = vehicleImages[vehicleId] || [];

    if (images.length === 0) return;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] - 1 + images.length) % images.length,
    }));
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

      <ImageContainer
  style={{ overflow: "hidden", position: "relative" }}
  onMouseMove={(e) => handleMouseMove(e)}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
  <PrevButton onClick={handlePrevImage} style={{ zIndex: 10 }}>◀</PrevButton>

  <CarImage
    src={
      selectedVehicle && vehicleImages[selectedVehicle.usersRV_ID]
        ? vehicleImages[selectedVehicle.usersRV_ID][
            currentImageIndex[selectedVehicle.usersRV_ID] || 0
          ]
        : "/default-placeholder.png"
    }
    alt={selectedVehicle?.carName || "Car Image"}
    style={{
      transform: hovered ? "scale(1.5)" : "scale(1)",
      transformOrigin: `${position.x}% ${position.y}%`,
      transition: "transform 0.3s ease-in-out",
      position: "relative",
      zIndex: 5, // Keeps image below buttons
    }}
  />

  <NextButton onClick={handleNextImage} style={{ zIndex: 10 }}>▶</NextButton>
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
        <AddImage usersRV_ID={selectedVehicle?.usersRV_ID} />
      </DetailsBox>
    </CarDetailsContainer>
  );
};

export default CarDetails;
