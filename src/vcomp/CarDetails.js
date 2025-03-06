import React from 'react';
import styled from 'styled-components';

// Replace with the actual path to your image
import carImage from '/mazda.png';

const CarDetailsContainer = styled.div`
  font-family: sans-serif;
  width: 600px; // Adjust as needed
  margin: 20px auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
  padding: 20px;
  margin: 0;
  font-size: 2em;
  font-weight: bold;
  text-transform: uppercase;
`;

const CarImage = styled.img`
  width: 100%;
  display: block;
`;

const DetailsBox = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  border: 2px solid black; // Added black border to DetailsBox
  border-radius: 0 0 10px 10px; // Add border-radius to bottom corners
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailItem = styled.div`
  font-size: 1em;
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