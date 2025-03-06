"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Background from '@/vcomp/background.js';
import CarPartRegistrationForm from '../../vcomp/CarParts_Registration.js';
import NavBar from '../../vcomp/NavBar'; 

const AppContainer = styled.div` 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #131415;
  color: gold;
`;

const NavBarContainer = styled.div`
  /* Add any specific styling for the NavBar container if needed */
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column; 
  justify-content: center; // Center the button vertically
  align-items: center;
  flex-grow: 1; // Allow this container to take up available space
  background-color: #131415;
  color: gold;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #242424;
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

const CarPartRegistrationPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  return (
    <AppContainer> {/* Wrap everything in AppContainer */}
      <NavBarContainer> {/* Separate container for NavBar */}
        <NavBar /> 
      </NavBarContainer>
      <Background />
      <PageContainer> {/* Container for the button and form */}
        {showForm ? (
          <CarPartRegistrationForm />
        ) : (
          <Button onClick={handleButtonClick}>Add a Car Part</Button>
        )}
      </PageContainer>
    </AppContainer>
  );
};

export default CarPartRegistrationPage;