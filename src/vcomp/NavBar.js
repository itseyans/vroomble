"use client"; // Add this line at the top

import React from 'react';
import styled from 'styled-components';

// ... your NavBar component code

const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  padding: 1rem;
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

const NavItem = styled.a`
  color: gold;
  text-decoration: none;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 215, 0, 0.2);
  }
`;

const NavBar = () => {
  return (
    <NavBarContainer>
      <Logo>VROOMBLE</Logo>
      <EmblemContainer>
        <Emblem src="/images/emblem.png" alt="Emblem" />
      </EmblemContainer>
      <NavItem href="#">Home</NavItem>
      <NavItem href="#">About</NavItem>
      <NavItem href="#">Services</NavItem>
      <NavItem href="#">Contact</NavItem>
      <NavItem href="#">Register</NavItem>
    </NavBarContainer>
  );
};

export default NavBar;