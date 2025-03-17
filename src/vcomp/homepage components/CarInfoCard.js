"use client";
import React from "react";
import styled from "styled-components";

//  Main Container for Car Info
const CarInfoCardContainer = styled.div`
  background-color: #d9d9d9;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 610px;
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//  Car Image Container (Fixed Size)
const CarImageContainer = styled.div`
  width: 600px;
  height: 300px;
  background-color: #b0b0b0; /*  Placeholder Background */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
`;

//  Car Image
const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${({ isVisible }) => (isVisible ? "block" : "none")}; /* Hide if not available */
`;

//  Car Details Wrapper
const CarDetailsWrapper = styled.div`
  padding: 10px;
  width: 100%;
  text-align: center;
`;

//  Car Name
const CarName = styled.h3`
  margin: 5px 0;
  font-size: 1.4rem;
  font-weight: bold;
  color: black;
`;

//  Total Spent
const TotalSpent = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  color: black;
`;

//  Main Component Function
const CarInfoCard = ({ imageUrl, carName, totalSpent }) => {
  return (
    <CarInfoCardContainer>
      {/*  Image Placeholder Handling */}
      <CarImageContainer>
        {imageUrl ? (
          <CarImage
            src={imageUrl}
            alt={carName}
            isVisible={true}
            onError={(e) => (e.target.style.display = "none")} // Hide image if it fails to load
          />
        ) : (
          <span style={{ fontSize: "1rem", color: "#fff" }}>No Image Available</span>
        )}
      </CarImageContainer>

      {/*  Car Details */}
      <CarDetailsWrapper>
        <CarName>{carName || "Car Name Here"}</CarName>
        <TotalSpent>TOTAL SPENT: ₱{totalSpent || "0.00"}</TotalSpent>
      </CarDetailsWrapper>
    </CarInfoCardContainer>
  );
};

export default CarInfoCard;
