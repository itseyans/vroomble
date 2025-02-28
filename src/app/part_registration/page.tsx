"use client"; // Assuming you're using Next.js with the "use client" directive

import React, { useState } from 'react';
import styled from 'styled-components';
import CarPartRegistrationForm from '../../vcomp/CarParts_Registration.js';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
    <PageContainer>
      {showForm ? (
        <CarPartRegistrationForm />
      ) : (
        <Button onClick={handleButtonClick}>Add a Car Part</Button>
      )}
    </PageContainer>
  );
};

export default CarPartRegistrationPage;