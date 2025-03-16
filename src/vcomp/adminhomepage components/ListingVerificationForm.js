"use client"; 

import React from "react";
import styled from "styled-components";

// Styled component for the container
const StyledContainer = styled.div`
  width: 1400px;
  height: 750px;
  background-color: #d9d9d9;
  border: 8px solid #FFC629;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #131415;  /* Set default text color */
`;

// Styled Heading for consistency (optional but recommended)
const Heading = styled.h2`
  color: inherit; /* Automatically inherits color from parent */
`;

const ListingVerificationForm = () => {
  return (
    <StyledContainer>
      <Heading>FUTURE FEATURE!</Heading>
    </StyledContainer>
  );
};

export default ListingVerificationForm;
