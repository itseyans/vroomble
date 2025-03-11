"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

const AdminNavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const LogoBackground = styled.div`
  width: 180px; /* Adjust for proper proportions */
  height: 80px;
  background-color: #d9d9d9;
  position: absolute;
  left: 0;
  top: 0;
  clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%);
  z-index: 1;
`;

const LogoImage = styled.img`
  width: 70px;
  height: auto;
  position: relative;
  z-index: 2;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* ✅ Increased spacing between VROOMBLE & ADMIN */
  margin-left: 100px; /* Ensures text does not overlap the shape */
  z-index: 2;
`;

const LogoText = styled.span`
  font-weight: bold;
  font-size: 2.5rem;
  font-family: "Shrikhand", sans-serif;
  color: #ffc629;
`;

const AdminText = styled.span`
  font-weight: bold;
  font-size: 2.5rem;
  font-family: "Shrikhand", sans-serif;
  color: #d9d9d9;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavItem = styled(Link)`
  color: gold;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ffc629;
  }
`;

const LogoutButton = styled.button`
  background-color: #ffc629;
  color: black;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background-color: #e5bd3f;
    transform: scale(1.05);
  }
`;

const AdminNavBar = () => {
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

  return (
    <AdminNavBarContainer>
      <LogoContainer>
        <LogoBackground />
        <LogoImage src="/LOGO.png" alt="Vroomble Logo" />
        <LogoWrapper>
          <LogoText>VROOMBLE</LogoText>
          <AdminText>ADMIN</AdminText>
        </LogoWrapper>
      </LogoContainer>

      <NavItems>
        <NavItem href="/homepage">Home</NavItem>
        <NavItem href="/vehicle_registration">Vehicle Registration</NavItem>
        <NavItem href="/part_registration">Car Part Registration</NavItem>
        <LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setIsLoggedIn(false);
            setUserRole(null);
            window.location.href = "/";
          }}
        >
          LOGOUT
        </LogoutButton>
      </NavItems>
    </AdminNavBarContainer>
  );
};

export default AdminNavBar;
