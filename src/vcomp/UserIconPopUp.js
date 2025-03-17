"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Container for the pop-up
const PopUpContainer = styled.div`
  width: 180px;
  padding: 15px;
  background-color: #D9D9D9; /*  Updated Background */
  border: 3px solid #FFC629; /*  Updated Border Color */
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: "Segoe UI Variable", sans-serif;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

//  Styled button component
const PopUpButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
  text-align: center;

  &:hover {
    transform: scale(1.05);
  }
`;

// Services Button (Yellow)
const ServicesButton = styled(PopUpButton)`
  background-color: #FFC629;
`;

//  Logout Button (Red)
const LogoutButton = styled(PopUpButton)`
  background-color: #F66B6B;
`;

const UserIconPopUp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = "/"; // Redirects to /homepage
  };

  return (
    <PopUpContainer>
      <ServicesButton>SERVICES</ServicesButton>
      <LogoutButton onClick={handleLogout}>LOGOUT</LogoutButton>
    </PopUpContainer>
  );
};

export default UserIconPopUp;
