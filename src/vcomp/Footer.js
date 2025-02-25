"use client";

import React from "react";
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

  &:hover {
    background-color: rgba(255, 215, 0, 0.2);
  }
`;

const Footer = () => {
                              return (
                                <FooterContainer>
                                  <FooterItems>
                                    <FooterItem href="#">Contact</FooterItem> {/* About in footer */}
                                    <FooterItem href="#">About Us</FooterItem> {/* Contact in footer */}
                                  </FooterItems>
                                </FooterContainer>
                              );
                            };

export default Footer;