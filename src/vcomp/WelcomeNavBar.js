"use client";

import React, { useState } from "react";
import styled from "styled-components";
import RegistrationForm from "./RegistrationForm.js";
import LoginForm from "./LoginForm.js";

const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  position: relative;
  height: 8rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Shrikhand', cursive;
  font-size: 3.5rem;
  color: gold;
`;

const EmblemBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #d9d9d9;
  width: 15rem;
  height: 8rem;
  clip-path: polygon(12% 100%, 88% 100%, 100% 0, 0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const EmblemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7rem;
  height: 7rem;
`;

const Emblem = styled.img`
  width: 100%;
  height: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const NavButton = styled.button`
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: gold;
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem; /* Added margin to push forms lower */
`;

const WelcomeNavBar = () => {
  const [activeForm, setActiveForm] = useState(null);

  const toggleForm = (formType) => {
    setActiveForm((prevForm) => (prevForm === formType ? null : formType));
  };

  return (
    <>
      <NavBarContainer>
        <LogoContainer>VROOMBLE</LogoContainer>
        <EmblemBackground>
          <EmblemContainer>
            <Emblem src="/LOGO.png" alt="Vroomble Logo" />
          </EmblemContainer>
        </EmblemBackground>
        <ButtonContainer>
          <NavButton onClick={() => toggleForm("login")}>Sign In</NavButton>
          <NavButton onClick={() => toggleForm("register")}>Register</NavButton>
        </ButtonContainer>
      </NavBarContainer>

      {/* Show Forms on Click */}
      <FormContainer>
        {activeForm === "register" && <RegistrationForm />}
        {activeForm === "login" && <LoginForm />}
      </FormContainer>
    </>
  );
};

export default WelcomeNavBar;
