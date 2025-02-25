import React from "react";
import styled from "styled-components";

const ApproveButton = styled.button`
  font-size: 20px;
  font-family: "Segoe UI Variable", sans-serif; /* Set font */
  font-weight: 700; /* Bold Display */
  color: #131415;
  width: 155px;
  height: 35px;
  border: 2px solid #4aec42;
  border-radius: 20px;
  transition: background-color 0.3s;
  background-color: #4aec42;

  &:hover {
    background-color: #ffffff;
    cursor: pointer;
    border: 2px solid #000000;
  }

  }
`;

export default ApproveButton;
