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
  justify-content: space-between; // Space between logo and links
  width: 100%;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
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

const RegisterButton = styled.button`
  background-color: gold;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem; // Add some space between login and register
`;

const WelcomeNavBar = () => {
  return (
    <NavBarContainer>
      <NavItems>
        {/* ... (Logo and Emblem) */}
      </NavItems>
      <div>
        <Link href="/homepage"> 
          <NavItem> {/* NavItem wraps the text content only */}
            Login
          </NavItem>
        </Link>
        <Link href="/register">
          <RegisterButton>Register</RegisterButton> 
        </Link>
      </div>
    </NavBarContainer>
  );
};

export default WelcomeNavBar;