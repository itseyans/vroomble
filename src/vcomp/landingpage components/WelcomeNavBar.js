"use client";

import React, { useState } from "react";
import styled from "styled-components";
import RegistrationForm from "../RegistrationForm.js";
import LoginForm from "../LoginForm.js";
import Link from 'next/link'; // Import Link from Next.js
import PredictForm from "@/vcomp/PredictForm";

// ✅ Black Navbar Container
const NavBarContainer = styled.nav`
  background-color: #131415;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  position: relative;
  height: 8rem;
  margin-bottom: 0;
  z-index: 1000;
`;

// ✅ Logo Design
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Shrikhand", cursive;
  font-size: 3.5rem;
  color: gold;
`;

// ✅ Emblem Background (Restored)
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
  z-index: 1002;
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

const YellowSection = styled.div`
  background-color: #ffc629;
  height: 200px;
  width: 100%;
  clip-path: polygon(20% 100%, 80% 100%, 100% 0, 0% 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3); /* Dark overlay */
  backdrop-filter: blur(10px); /* ✅ Blurs everything */
  z-index: 1000; /* ✅ Below the pop-up but above the content */
`;

// ✅ Popup Container (Ensures form is above the overlay)
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 0;
  text-align: center;
  z-index: 1001; /* ✅ Ensure it's above the blur */
  border: none;
  width: auto;
`;

// Close Button (Fixed Visibility + Better Positioning)
const CloseButton = styled.button`
  position: absolute;
  top: -15px;
  right: -15px;
  background: black;
  color: white;
  border: 2px solid white;
  font-size: 16px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1002;
  transition: background 0.2s;

  &:hover {
    background: red;
  }
`;

const WelcomeNavBar = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [showPredictForm, setShowPredictForm] = useState(false); // State for PredictForm modal

  const toggleForm = (formType) => {
    setActiveForm((prevForm) => (prevForm === formType ? null : formType));
  };

  return (
    <>
      {/* Black Navbar */}
      <NavBarContainer>
        <LogoContainer>VROOMBLE</LogoContainer>

        {/* Restored Emblem */}
        <EmblemBackground>
          <EmblemContainer>
            <Emblem src="/LOGO.png" alt="Vroomble Logo" />
          </EmblemContainer>
        </EmblemBackground>

        <ButtonContainer>
          <NavButton onClick={() => setShowPredictForm(true)}>Car Builder</NavButton>                    
          <NavButton onClick={() => toggleForm("login")}>Sign In</NavButton>
          <NavButton onClick={() => toggleForm("register")}>Register</NavButton>
        </ButtonContainer>
      </NavBarContainer>

      {/* Yellow Section */}
      <YellowSection>
        <StatsContainer>
          <StatBox>
            <span>Registered Cars</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <span>Listed Vehicles</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <span>Registered Users</span>
            <span>001</span>
          </StatBox>
          <StatBox>
            <span>Registered Users</span>
            <span>001</span>
          </StatBox>
        </StatsContainer>
      </YellowSection>

      {/* Blurred Background when Popup is Active */}
      {activeForm && <BlurOverlay onClick={() => setActiveForm(null)} />}
      {showPredictForm && <BlurOverlay onClick={() => setShowPredictForm(false)} />}

      {/* Popup Forms (Now with Close Button) */}
      {activeForm && (
        <ModalContainer>
          <CloseButton onClick={() => setActiveForm(null)}>X</CloseButton>

          {activeForm === "register" && <RegistrationForm />}
          {activeForm === "login" && <LoginForm />}
        </ModalContainer>
      )}

      {showPredictForm && (
        <ModalContainer>
          <CloseButton onClick={() => setShowPredictForm(false)}>X</CloseButton>
          <PredictForm />
        </ModalContainer>
      )}
    </>
  );
};

export default WelcomeNavBar;