"use client";
import React from "react";
import styled from "styled-components";

// ✅ Main Container for Car Info
const CarInfoCardContainer = styled.div`
  background-color: #d9d9d9; /* Temporary Background for Visualization */
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 610px; /* ✅ Matches image width */
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
`;

// ✅ Car Image Container (Fixed Size 500x300)
const CarImageContainer = styled.div`
  width: 600px;
  height: 300px;
  background-color: #b0b0b0; /* ✅ Placeholder Background */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
`;

// ✅ Car Image
const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// ✅ Car Details Wrapper (Ensures proper left alignment)
const CarDetailsWrapper = styled.div`
  padding: 10px; /* ✅ Adds padding for spacing */
`;

// ✅ Car Name (Left-Aligned & Spacing Adjusted)
const CarName = styled.h3`
  margin: 1px 0 1px 0; /* ✅ Reduced bottom margin */
  font-size: 1.4rem;
  font-weight: bold;
  color: black;
  text-align: left; /* ✅ Left-Aligned */
`;

// ✅ Total Spent (Left-Aligned & Peso Sign)
const TotalSpent = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin: 0; /* ✅ Removes extra bottom spacing */
  color: black;
  text-align: left; /* ✅ Left-Aligned */
`;

// ✅ Main Component Function
const CarInfoCard = ({ imageUrl, carName, totalSpent }) => {
  return (
    <CarInfoCardContainer>
      {/* ✅ Image Placeholder */}
      <CarImageContainer>
        {imageUrl ? (
          <CarImage src={imageUrl} alt={carName} />
        ) : (
          "Car Image Here"
        )}
      </CarImageContainer>

      {/* ✅ Car Details Section */}
      <CarDetailsWrapper>
        <CarName>{carName || "Car Name Here"}</CarName>
        <TotalSpent>TOTAL SPENT: ₱{totalSpent || "0.00"}</TotalSpent>
      </CarDetailsWrapper>
    </CarInfoCardContainer>
  );
};

export default CarInfoCard;
