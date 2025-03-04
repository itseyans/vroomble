"use client";

import React, { useState } from "react";
import styled from "styled-components";
import RegistrationForm from "./RegistrationForm.js";
import LoginForm from "./LoginForm.js";

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

const WelcomeNavBar = () => {
  const [showReg, setShowReg] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const handleLogin = () => {
    setShowLog(true);
    setShowReg(false); // Hide registration form
  };

  const handleRegister = () => {
    setShowReg(true);
    setShowLog(false); // Hide login form
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
          <>
            <LoginButton onClick={handleLogin}>Login</LoginButton>
          </>
          <RegisterButton onClick={handleRegister}>Register</RegisterButton>
        </NavItems>
      </NavBarContainer>

      {/* The forms after button click */}

      <center>
        {showReg && <RegistrationForm />}
      </center>

      <center>
        {showLog && <LoginForm />}
      </center>
    </>
  );
};

export default WelcomeNavBar;