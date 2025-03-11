'use client';

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import UserIconPopUp from "@/vcomp/UserIconPopUp";

// Styled Components Definitions
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Shrikhand", cursive;
  font-size: 2.8rem;
  color: #E5BD3F;
`;

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

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 2rem;
  position: relative;
`;

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

const UserIconContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserIcon = styled.img`
  width: 45px;
  height: 45px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const PopUpWrapper = styled.div`
  position: absolute;
  top: 90px;
  right: -50px;
  z-index: 100;
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
`;

const GeneralNavBar = () => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <NavBarContainer>
      <LogoContainer>
        <Link href="/homepage" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          VROOMBLE
        </Link>
      </LogoContainer>

      <EmblemBackground>
        <EmblemContainer>
          <Emblem src="/LOGO.png" alt="Vroomble Logo" />
        </EmblemContainer>
      </EmblemBackground>

      <RightContainer>
        <NavButton onClick={() => router.push("/homepage")}>HOME</NavButton>
        <NavButton onClick={() => router.push("/prediction_page")}>CAR BUILDER</NavButton>
        <NavButton onClick={() => router.push("/vehicle_listing")}>VIEW LISTINGS</NavButton>

        <UserIconContainer>
          <UserIcon
            src="/usericonround.png"
            alt="User Profile"
            onClick={() => setShowPopUp(!showPopUp)}
          />
          <PopUpWrapper $isVisible={showPopUp}>
            <UserIconPopUp />
          </PopUpWrapper>
        </UserIconContainer>
      </RightContainer>
    </NavBarContainer>
  );
};

export default GeneralNavBar;