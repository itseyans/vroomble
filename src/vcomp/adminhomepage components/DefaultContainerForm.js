"use client";

import React from "react";
import styled from "styled-components";

// Main Styled Container
const StyledContainer = styled.div`
  width: 1400px;
  height: 750px;
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  position: relative; 
`;

// Editable Welcome Text
const WelcomeText = styled.div`
  background-color: transparent;
  color: #131415;
  font-weight: bold;
  padding: 0.8rem 2rem;
  border: 3px solid #FFC629;
  border-radius: 12px;
  font-size: 1.2rem;
  display: inline-block;
  margin-top: 30px;
  margin-left: 30px;
`;

// Container for both sections aligned right
const SectionsWrapper = styled.div`
  position: absolute;
  top: 100px; 
  right: 50px; 
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

// Individual section container (fixed with transient prop)
const SectionContainer = styled.div`
  width: 500px;
  height: 220px;
  background-color: transparent;
  border: 5px solid ${(props) => props.$borderColor};
  border-radius: 12px;
  padding: 1rem;
`;

// Section Title
const SectionTitle = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${(props) => props.color};
  margin-bottom: 1rem;
`;

const DefaultContainerForm = () => {
  return (
    <StyledContainer>
      <WelcomeText>Welcome, Joseph!</WelcomeText>

      <SectionsWrapper>
        <SectionContainer $borderColor="#F66B6B">
          <SectionTitle color="#F66B6B">URGENT</SectionTitle>
          {/* Urgent Content Goes Here */}
        </SectionContainer>

        <SectionContainer $borderColor="#4A90E2">
          <SectionTitle color="#4A90E2">UPDATES</SectionTitle>
          {/* Updates Content Goes Here */}
        </SectionContainer>
      </SectionsWrapper>
    </StyledContainer>
  );
};

export default DefaultContainerForm;
