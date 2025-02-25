import React from "react";
import styled from "styled-components";

const GeneralButton = styled.button`
  font-size: 20px;
  font-family: "Segoe UI Variable", sans-serif; /* Set font */
  font-weight: 700; /* Bold Display */
  color: #131415;
  padding: 15px 20px; /* Dynamic padding instead of fixed width/height */
  border: 2px solid #000000;
  border-radius: 12px;
  transition: background-color 0.3s;
  background-color: #f4f4f5;
  display: inline-block; /* Prevents button from stretching full width */
  white-space: nowrap; /* Prevents text from wrapping to new lines */
  min-width: 140px; /* Ensures button has a minimum size */
  max-width: 250px; /* Prevents it from becoming too wide */
  text-align: center; /* Ensures text is centered */

  &:hover {
    background-color: #d9d9d9;
    cursor: pointer;
    border: 2px solid #000000;
  }
`;

export default GeneralButton;
