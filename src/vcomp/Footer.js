"use client";

import React from "react";
import Link from "next/link"; // Import the Link component
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

const FooterItem = styled.div` // Changed from 'a' to 'div'
    color: gold;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;

    &:hover {
        background-color: rgba(255, 215, 0, 0.2);
    }
`;

const Footer = () => {
    return (
        <FooterContainer>
            <FooterItems>
                <Link href="/about">
                    <FooterItem>Contact</FooterItem> {/* No more <a> tag here */}
                </Link>
                <Link href="/about">
                    <FooterItem>About Us</FooterItem>
                </Link>
            </FooterItems>
        </FooterContainer>
    );
};

export default Footer;