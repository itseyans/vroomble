"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: black;
  color: gold;
  padding: 1rem;
  text-align: center;
`;

const FooterItems = styled.div`
  display: flex;
  justify-content: center;
`;

const FooterItem = styled.a`
  color: gold;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 215, 0, 0.2);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterItems>
        <Link href="/about_us" passHref legacyBehavior>
          <FooterItem>About Us</FooterItem> 
        </Link>

        <Link href="/contacts" passHref legacyBehavior>
          <FooterItem>Contact</FooterItem> 
        </Link>
      </FooterItems>
    </FooterContainer>
  );
};

export default Footer;
