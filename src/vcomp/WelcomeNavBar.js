"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";

const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: center; // Center all items
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // Add this line
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

const WelcomeNavBar = () => {
  return (
    <NavBarContainer>
      <NavItems>
        {/* Logo and Title (Left) */}
        <LogoContainer>
          <Logo>VROOMBLE</Logo>
          <EmblemContainer>
            <Emblem src="/images/emblem.png" alt="Emblem" />
          </EmblemContainer>
        </LogoContainer>

        {/* Landing Page Navbar (Login & Register - Right) */}
        <div> {/* Removed inline style */}
          <Link href="/login">
            <NavItem>Login</NavItem>
          </Link>
          <Link href="/register">
            <NavItem>Register</NavItem>
          </Link>
        </div>
      </NavItems>
    </NavBarContainer>
  );
};

export default WelcomeNavBar;