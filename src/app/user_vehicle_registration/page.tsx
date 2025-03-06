"use client";

import React, {useState} from 'react';
import styled from 'styled-components';
import Background from '../../vcomp/background';
import NavBar from '../../vcomp/NavBar.js';
import RegisterVehicle from "../../vcomp/RegisterVehicle.js";
import Footer from "../../vcomp/Footer.js";

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
const VehicleRegistrationPage = () => {
    const [showForm, setShowForm] = useState(false);
  
    const handleButtonClick = () => {
      setShowForm(true);
    };
  
    return (
      <AppContainer> 
        <NavBarContainer> 
          <NavBar /> 
        </NavBarContainer>
        <Background />
        <PageContainer> 
          {showForm ? (
            <RegisterVehicle /> 
          ) : (
            <Button onClick={handleButtonClick}>Register a Vehicle</Button>
          )}
        </PageContainer>
        <Footer />
      </AppContainer>
    );
  };
  
  export default VehicleRegistrationPage;


