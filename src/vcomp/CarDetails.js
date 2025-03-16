import React, { useState, useEffect } from "react";
import styled from "styled-components";

// ✅ Styled Components
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

const CarImage = styled.img`
  width: 100%;
  display: block;
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

            return {
              usersRV_ID: vehicle.usersRV_ID,
              carName: vehicle.carName,
              year: vehicle.year,
              imageUrl: imageData.images.length > 0
                ? `http://localhost:8004/car_images/${imageData.images[0]}`
                : "/default-placeholder.png",
            };
          })
        );

        setVehicles(vehicleDetails);

        if (vehicleDetails.length > 0) {
          setSelectedVehicle(vehicleDetails[0]);
          onVehicleSelect(vehicleDetails[0]); // ✅ Pass selected vehicle up
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
    onVehicleSelect(selected); // ✅ Notify parent
  };

  return (
    <CarDetailsContainer>
      {/* ✅ Title with Dropdown */}
      <TitleContainer>
        <CarSelect onChange={handleVehicleChange} value={selectedVehicle?.usersRV_ID || ""}>
          {vehicles.map((vehicle) => (
            <option key={vehicle.usersRV_ID} value={vehicle.usersRV_ID}>
              {vehicle.carName}
            </option>
          ))}
        </CarSelect>
      </TitleContainer>

      {/* ✅ Vehicle Image */}
      <CarImage 
        src={selectedVehicle?.imageUrl} 
        alt={selectedVehicle?.carName || "Car Image"} 
        onError={(e) => e.target.src = "/default-placeholder.png"} // ✅ Fallback if image is missing
      />

      {/* ✅ Vehicle Details */}
      <DetailsBox>
        <DetailColumn>
          <DetailItem>{selectedVehicle?.carName || "Unknown Car"}</DetailItem>
          <DetailItem>{selectedVehicle?.year || "N/A"} Model</DetailItem>
          <DetailItem>2.0L Naturally Aspirated I4</DetailItem>
          <DetailItem>181 bhp (135kw)</DetailItem>
        </DetailColumn>
        <DetailColumn>
          <DetailItem>Front-Engine</DetailItem>
          <DetailItem>Rear Wheel Drive</DetailItem>
          <DetailItem>1112 KG</DetailItem>
          <DetailItem>6 Speed Trans</DetailItem>
        </DetailColumn>
      </DetailsBox>
    </CarDetailsContainer>
  );
};

export default CarDetails;
