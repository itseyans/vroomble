"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import RegistrationForm from "./RegistrationForm.js";

const NavBarContainer = styled.nav`
  margin-bottom: 50px;
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: center;
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
  margin-left: 50px;
`;

const LoginButton = styled.button`
  background-color: gold;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1100px;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #131415;
  color: gold;
  flex-direction: column;
`;

const WelcomeNavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showReg, setShowReg] = useState(false); // State for registration form visibility

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const handleRegister = () => {
    setShowReg(true); // Set state to show registration form
  };

  return (
    <>
      <NavBarContainer>
        <NavItems>
          <LogoContainer>
            <Logo>VROOMBLE</Logo>
            <EmblemContainer>
              <Emblem src="/images/emblem.png" alt="Emblem" />
            </EmblemContainer>
          </LogoContainer>

          {isLoggedIn ? (
            userRole === "admin" ? (
              <>
                <Link href="/admin/dashboard">
                  <NavItem>Dashboard</NavItem>
                </Link>
                <Link href="/admin/users">
                  <NavItem>Users</NavItem>
                </Link>
              </>
            ) : (
              <>
                <Link href="/home">
                  <NavItem>Home</NavItem>
                </Link>
                <Link href="/services">
                  <NavItem>Services</NavItem>
                </Link>
                <Link href="/part_registration">
                  <NavItem>Car Part Registration</NavItem>
                </Link>
              </>
            )
          ) : (
            <></>
          )}
        </NavItems>

        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <LoginButton onClick={handleLogin}>Login</LoginButton>
          </>
        )}
        <RegisterButton onClick={handleRegister}>Register</RegisterButton>
      </NavBarContainer>
      <center>
      {showReg && (
          <RegistrationForm />
      )}
      </center>
    </>
  );
};

export default WelcomeNavBar;