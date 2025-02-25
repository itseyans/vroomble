import React from "react";
import styled from "styled-components";

const RejectButton = styled.button`
  font-size: 20px;
  font-family: "Segoe UI Variable", sans-serif; /* Set font */
  font-weight: 700; /* Bold Display */
  color: #131415;
  width: 155px;
  height: 35px;
  border: 2px solid #F45A5A;
  border-radius: 20px;
  transition: background-color 0.3s;
  background-color: #F45A5A;

  &:hover {
    background-color: #ffffff;
    cursor: pointer;
    border: 2px solid #000000;
  }

  }
`;

export default RejectButton;
