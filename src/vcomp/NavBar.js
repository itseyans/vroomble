"use client";

import React from "react";
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
  margin-left: auto; // Push to the far right
`;

const NavBar = () => {
                              return (
                                <NavBarContainer>
                                  <NavItems>
                                    <LogoContainer>
                                      <Logo>VROOMBLE</Logo>
                                      <EmblemContainer>
                                        <Emblem src="/images/emblem.png" alt="Emblem" />
                                      </EmblemContainer>
                                    </LogoContainer>
                                    <NavItem href="#">Home</NavItem> {/* Services in navbar */}
                                    <NavItem href="#">Services</NavItem> 
                                  </NavItems>
                                  <RegisterButton>Register</RegisterButton>
                                </NavBarContainer>
                              );
                            };
export default NavBar;