"use client";

import React, { useState } from "react";
import styled from "styled-components";
import RegistrationForm from "./RegistrationForm.js";
import LoginForm from "./LoginForm.js";

// ✅ Black Navbar Container
const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  position: relative;
  height: 8rem;
  margin-bottom: 0;
`;

// ✅ Logo Design
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Shrikhand", cursive;
  font-size: 3.5rem;
  color: gold;
`;

// ✅ Emblem Background
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

// ✅ Emblem Logo
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

// ✅ Buttons (Sign In / Register)
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

// ✅ Yellow Section directly below the navbar
const YellowSection = styled.div`
  background-color: #ffc629;
  height: 200px;
  width: 100%;
  clip-path: polygon(25% 100%, 75% 100%, % 0, 0% 0);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 40px;
`;

const StatBox = styled.div`
  background-color: #ffc629;
  border: 3px solid black;
  border-radius: 10px;
  padding: 15px;
  width: 180px;
  height: 160px;
  text-align: center;
  font-family: "Segoe UI Variable", sans-serif;
  font-weight: bold;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CarIcon = styled.img`
  width: 70px;
  height: auto;
  margin-bottom: 12px;
`;

const UserIcon = styled.img`
  width: 65px;
  height: auto;
  margin-bottom: 12px;
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
      {/* ✅ Black Navbar */}
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

      {/* ✅ Yellow Section */}
      <YellowSection>
        <StatsContainer>
          <StatBox>
            <CarIcon src="/caricon.png" alt="Registered Cars" />
            <span>Registered Cars</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <CarIcon src="/caricon.png" alt="Listed Vehicles" />
            <span>Listed Vehicles</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <UserIcon src="/usericon.png" alt="Registered Users" />
            <span>Registered Users</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <UserIcon src="/usericon.png" alt="Registered Users" />
            <span>Registered Users</span>
            <span>001</span>
          </StatBox>
        </StatsContainer>
      </YellowSection>

      {/* ✅ Forms */}
      <FormContainer>
        {activeForm === "register" && <RegistrationForm />}
        {activeForm === "login" && <LoginForm />}
      </FormContainer>
    </>
  );
};

export default WelcomeNavBar;
