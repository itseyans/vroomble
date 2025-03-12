"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

const AdminNavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1.5rem; /* ✅ Slightly increased padding */
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem; /* ✅ Increased spacing */
`;

const EmblemContainer = styled.div`
  background-color: #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px; /* ✅ Increased size */
  height: 100px;
`;

const Emblem = styled.img`
  width: 80px; /* ✅ Logo size increased */
  height: auto;
  border-radius: 50%;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* ✅ More spacing between "VROOMBLE" and "ADMIN" */
`;

const LogoText = styled.span`
  font-weight: bold;
  font-size: 2.8rem; /* ✅ Bigger text */
  font-family: "Shrikhand", sans-serif;
  color: #ffc629;
`;

const AdminText = styled.span`
  font-weight: bold;
  font-size: 2.8rem; /* ✅ Bigger text */
  font-family: "Shrikhand", sans-serif;
  color: #d9d9d9;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem; /* ✅ Increased spacing between navbar items */
`;

const NavItem = styled(Link)`
  color: gold;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 10px 15px; /* ✅ Added padding for better spacing */
  border-radius: 6px;
  transition: background 0.3s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 215, 0, 0.2); /* ✅ Lightens the background slightly */
    color: #ffc629;
  }
`;

const LogoutButton = styled.button`
  background-color: #ffc629;
  color: black;
  padding: 12px 18px;
  font-weight: bold;
  font-size: 1.3rem;
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
        <EmblemContainer>
          <Emblem src="/LOGO.png" alt="Vroomble Logo" />
        </EmblemContainer>
        <LogoWrapper>
          <LogoText>VROOMBLE</LogoText>
          <AdminText>ADMIN</AdminText>
        </LogoWrapper>
      </LogoContainer>

      <NavItems>
        <NavItem href="/adminhomepage">Home</NavItem>
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
