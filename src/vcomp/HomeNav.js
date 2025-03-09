"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation"; // ✅ Import router for navigation

// ✅ Navbar Container (Full Width & Fixed to Top)
const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 4rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 6rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
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

// ✅ Right-Side Container for User Icon & Button
const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* ✅ Space between elements */
  padding-right: 2rem;
`;

// ✅ User Icon Section
const UserIcon = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

// ✅ Buy Cars Button
const BuyButton = styled.button`
  background-color: gold;
  color: black;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #ffcc00;
    transform: scale(1.05);
  }
`;

const HomeNav = () => {
  const router = useRouter(); // ✅ Initialize router

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

      {/* Right: Buy Vehicles Button + User Icon */}
      <RightContainer>
        <BuyButton onClick={() => router.push("/ListedVehiclesPage")}>
          BUY VEHICLES
        </BuyButton>
        <UserIcon src="/usericonround.png" alt="User Profile" />
      </RightContainer>
    </NavBarContainer>
  );
};

export default HomeNav;
