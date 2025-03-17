"use client";
import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 335px;
  height: 233px;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  border: 4px solid #ffc629;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;

  &:hover .hoverOverlay {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
`;

const CarImageContainer = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f5;
`;

const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  transition: opacity 0.3s ease-in-out;
`;

const LabelContainer = styled.div`
  background-color: black;
  color: white;
  padding: 15px 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Hover Overlay */
const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

const ListingCard = ({ carName, imageUrl, dateListed }) => {
  return (
    <CardContainer>
      <CarImageContainer>
        {imageUrl ? (
          <CarImage
            src={imageUrl}
            alt={carName}
            onError={(e) => (e.currentTarget.style.display = "none")} // ✅ Hides if image fails
          />
        ) : (
          <div style={{ height: "100%", width: "100%", backgroundColor: "#f4f4f5" }} />
        )}
      </CarImageContainer>
      <LabelContainer>{carName}</LabelContainer>

      {/* Hover effect */}
      <HoverOverlay className="hoverOverlay">{dateListed}</HoverOverlay>
    </CardContainer>
  );
};

export default ListingCard;
