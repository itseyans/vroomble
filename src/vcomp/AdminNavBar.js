'use client';

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Link from 'next/link';

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
  gap: 5rem; /* ✅ Adds spacing between VROOMBLE and ADMIN */
  font-family: "Shrikhand", cursive;
  font-size: 2.8rem;
  color: #E5BD3F;
`;

const AdminText = styled.span`
  font-family: "Shrikhand", cursive;
  font-size: 2.8rem;
  font-weight: bold;
  color: #D9D9D9; /* ✅ ADMIN text in gray */
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

const LogoutButton = styled.button`
  background-color: #f66b6b;
  color: black;
  padding: 12px 18px;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background-color: #e5bd3f;
    transform: scale(1.05);
  }
`;

const AdminNavBar = () => {
  const router = useRouter();

  return (
    <NavBarContainer>
      <LogoContainer>
        <Link href="/adminhomepage" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          VROOMBLE
        </Link>
        <AdminText>ADMIN</AdminText>
      </LogoContainer>
      <EmblemBackground>
        <EmblemContainer>
          <Emblem src="/LOGO.png" alt="Vroomble Logo" />
        </EmblemContainer>
      </EmblemBackground>
      <RightContainer>
        <NavButton onClick={() => router.push("/adminhomepage")}>HOME</NavButton>
        <NavButton onClick={() => router.push("/adminhomepage")}>ANALYSIS</NavButton>
        <NavButton onClick={() => router.push("/part_registration")}>PART REG</NavButton>
        <NavButton onClick={() => router.push("/vehicle_registration")}>VEHICLE REG</NavButton>
        <LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setIsLoggedIn(false);
            setUserRole(null);
            window.location.href = "/";
          }}
        >
          LOGOUT
        </LogoutButton>
      </RightContainer>
    </NavBarContainer>
  );
};

export default AdminNavBar;