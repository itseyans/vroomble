"use client";

import React from "react";
import styled from "styled-components";

// ✅ Navbar Container (Full Width & Fixed to Top)
const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 4rem;
  position: fixed; /* ✅ Sticks to the top */
  top: 0;
  left: 0;
  width: 100%; /* ✅ Spans full width */
  height: 6rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 10; /* ✅ Ensure it's above everything */
`;

// ✅ Logo Section
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Shrikhand", cursive;
  font-size: 2.8rem;
  color: gold;
  padding-left: 2rem;
`;

// ✅ Emblem Background (Adjust Centering)
const EmblemBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #d9d9d9;
  width: 12rem;
  height: 6rem;
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
  width: 5rem;
  height: 5rem;
`;

const Emblem = styled.img`
  width: 100%;
  height: auto;
`;

// ✅ User Icon Section (Aligned to Right)
const UserIconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 2rem;
`;

const UserIcon = styled.img`
  width: 45px; /* Adjust size as needed */
  height: 45px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const HomeNav = () => {
  return (
    <NavBarContainer>
      {/* Left: VROOMBLE Logo */}
      <LogoContainer>VROOMBLE</LogoContainer>

      {/* Center: Emblem */}
      <EmblemBackground>
        <EmblemContainer>
          <Emblem src="/LOGO.png" alt="Vroomble Logo" />
        </EmblemContainer>
      </EmblemBackground>

      {/* Right: User Icon */}
      <UserIconContainer>
        <UserIcon src="/usericonround.png" alt="User Profile" />
      </UserIconContainer>
    </NavBarContainer>
  );
};

export default HomeNav;
