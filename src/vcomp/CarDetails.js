import React from 'react';
import styled from 'styled-components';

// Replace with the actual path to your image
import carImage from '/mazda.png';

const CarDetailsContainer = styled.div`
  font-family: sans-serif;
  width: 400px; // Reduced width
  margin: 10px auto; // Reduced margin
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
  padding: 10px; // Reduced padding
  margin: 0;
  font-size: 1.2em; // Reduced font size
  font-weight: bold;
  text-transform: uppercase;
`;

const CarImage = styled.img`
  width: 100%;
  display: block;
  // Replace with your actual image path
`;

const DetailsBox = styled.div`
  background-color: #f9f9f9;
  padding: 15px; // Reduced padding
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px; // Reduced gap
  border: 2px solid black;
  border-radius: 0 0 10px 10px;
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px; // Reduced gap
`;

const DetailItem = styled.div`
  font-size: 1 em; // Reduced font size
  color: #555;
`;

const CarDetails = () => {
  return (
    <CarDetailsContainer>
      <Title>MAZDA MX-5 MIATA RF</Title>
      <CarImage src={carImage} alt="Mazda MX-5 Miata RF" />
      <DetailsBox>
        <DetailColumn>
          <DetailItem>Mazda Japan</DetailItem>
          <DetailItem>2022 Production Car</DetailItem>
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