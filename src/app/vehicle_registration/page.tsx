"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import AddVehicle from '../../vcomp/AddVehicle.js';
import NavBar from '../../vcomp/landingpage components/LandingNavBar.js'; 

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh; 
  display: flex;
  flex-direction: column; 
`;

const ContentContainer = styled.div`
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  padding: 2rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: gold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #333;
  }
`;

const VehicleRegistrationPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  return (
    <PageContainer>
      <NavBar /> 
      <ContentContainer>
        <AddVehicle />
      </ContentContainer>
    </PageContainer>
  );
};

export default VehicleRegistrationPage;