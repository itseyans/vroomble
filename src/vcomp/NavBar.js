"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: center; // Center all items
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.a`
  color: gold;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 215, 0, 0.2);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 2rem;
`;

const EmblemContainer = styled.div`
  background-color: #e0e0e0;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
`;

const Emblem = styled.img`
  max-width: 100%;
  height: auto;
`;

const RegisterButton = styled.button`
  background-color: gold;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto; // Push to the far right
`;

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'

  useEffect(() => {
    // Check authentication and role (e.g., from local storage)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  },);

  const handleLogin = () => {
    // Perform login logic and update state
    setIsLoggedIn(true);
    //... (set userRole based on login response)
  };

  const handleLogout = () => {
    // Perform logout logic and update state
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <NavBarContainer>
      <NavItems>
        <LogoContainer>
          <Logo>VROOMBLE</Logo>
          <EmblemContainer>
            <Emblem src="/images/emblem.png" alt="Emblem" />
          </EmblemContainer>
        </LogoContainer>

        {isLoggedIn? (
          userRole === "admin"? (
            // Admin navbar
            <>
              <Link href="/admin/dashboard">
                <NavItem>Dashboard</NavItem>
              </Link>

              <Link href="/admin/users">
                <NavItem>Users</NavItem>
              </Link>
              {/*... other admin links */}
            </>
          ): (
            // User navbar
            <>
              <Link href="/home">
                <NavItem>Home</NavItem>
              </Link>
              
              <Link href="/services">
                <NavItem>Services</NavItem>
              </Link>
              {/*... other user links */}
            </>
          )
        ): (
          // Not logged in navbar (no buttons)
          <></>
        )}
      </NavItems>

      {isLoggedIn? (
        <button onClick={handleLogout}>Logout</button>
      ): (
        <RegisterButton onClick={handleLogin}>Register</RegisterButton>
      )}
    </NavBarContainer>
  );
};

export default NavBar;