"use client";

import React from "react";
import styled from "styled-components";

const YellowSection = styled.div`
  background-color: #ffc629;
  height: 200px;
  width: 100%;
  clip-path: polygon(5% 100%, 95% 100%, 98% 0, 2% 0);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;  /* Ensure no extra spacing */
  padding: 0;
  position: relative;
  z-index: 1;
  top: -2px; /* Move it up slightly */
`;



const StatsContainer = styled.div`
  display: flex;
  gap: 40px; /* Ensures proper spacing */
`;

const StatBox = styled.div`
  background-color: #ffc629; /* Exact match to YellowNavBar */
  border: 3px solid black;
  border-radius: 10px;
  padding: 15px;
  width: 180px; /* Increased width */
  height: 160px; /* Increased height */
  text-align: center;
  font-family: "Segoe UI Variable", sans-serif;
  font-weight: bold;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CarIcon = styled.img`
  width: 70px;  /* Slightly larger for balance */
  height: auto;
  margin-bottom: 12px;
`;

const UserIcon = styled.img`
  width: 65px;
  height: auto;
  margin-bottom: 12px;
`;

const YellowNavBar = () => {
  return (
    <YellowSection>
      <StatsContainer>
        <StatBox>
          <CarIcon src="/caricon.png" alt="Registered Cars" />
          <span>Registered Cars</span>
          <span>001</span>
        </StatBox>
        <StatBox>
          <CarIcon src="/caricon.png" alt="Listed Vehicles" />
          <span>Listed Vehicles</span>
          <span>001</span>
        </StatBox>
        <StatBox>
          <UserIcon src="/usericon.png" alt="Registered Users" />
          <span>Registered Users</span>
          <span>001</span>
        </StatBox>
        <StatBox>
          <UserIcon src="/usericon.png" alt="Registered Users" />
          <span>Registered Users</span>
          <span>001</span>
        </StatBox>
      </StatsContainer>
    </YellowSection>
  );
};

export default YellowNavBar;
