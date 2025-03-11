"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import UserIconPopUp from "@/vcomp/UserIconPopUp"; // ✅ Import pop-up component

// ✅ Navbar Container (Full Width & Fixed to Top)
const NavBarContainer = styled.nav`
  background-color: #131415;
  color: #E5BD3F;
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
  color: #E5BD3F;
`;

// ✅ Emblem Background (Adjust Centering)
const EmblemBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #D9D9D9;
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

// ✅ Right-Side Container for Buttons & User Icon
const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 2rem;
  position: relative; /* ✅ Needed to properly position the pop-up */
`;

// ✅ Styled Button
const NavButton = styled.button`
  background-color: #FFC629;
  color: #131415;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #FFEE8C;
    transform: scale(1.05);
  }
`;

// ✅ User Icon Section
const UserIconContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// ✅ User Icon Image
const UserIcon = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

// ✅ Pop-up Container (Fixes Prop Issue)
const PopUpWrapper = styled.div.attrs((props) => ({
  style: { display: props.$isVisible ? "block" : "none" }, // ✅ Use `$` prefix for styled-components props
}))`
  position: absolute;
  top: 90px;
  right: -50px;
  z-index: 100;
`;

const HomeNav = () => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <NavBarContainer>
      {/* ✅ Center: VROOMBLE Logo & Emblem */}
      <LogoContainer>VROOMBLE</LogoContainer>
      <EmblemBackground>
        <EmblemContainer>
          <Emblem src="/LOGO.png" alt="Vroomble Logo" />
        </EmblemContainer>
      </EmblemBackground>

      {/* ✅ Right: Home + View Listings + User Icon */}
      <RightContainer>
        <NavButton onClick={() => router.push("/homepage")}>HOME</NavButton>
        <NavButton onClick={() => router.push("/ListedVehiclesPage")}>
          VIEW LISTINGS
        </NavButton>

        {/* ✅ User Icon + Clickable Pop-up */}
        <UserIconContainer>
          <UserIcon
            src="/usericonround.png"
            alt="User Profile"
            onClick={() => setShowPopUp(!showPopUp)} // ✅ Toggle Pop-up Visibility
          />
          <PopUpWrapper $isVisible={showPopUp}>
            <UserIconPopUp /> {/* ✅ Displays the pop-up below the icon */}
          </PopUpWrapper>
        </UserIconContainer>
      </RightContainer>
    </NavBarContainer>
  );
};

export default HomeNav;
