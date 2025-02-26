"use client";

import React from "react";
import styled from "styled-components";

const ContactPage = styled.div`
  background-color: #131415;
  color: gold;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContactTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const ContactInfoContainer = styled.div`
  background-color: #242424;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
`;

const ContactText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const EmailLink = styled.a`
  color: gold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Contact: React.FC = () => {
  const emailAddress = "Vroomble@gmail.com"; // Replace with your actual email

  return (
    <ContactPage>
      <ContactTitle>Contact Us</ContactTitle>
      <ContactInfoContainer>
        <ContactText>
          Contact us through our email:
          <br />
          <EmailLink href={`mailto:${emailAddress}`}>{emailAddress}</EmailLink>
        </ContactText>
      </ContactInfoContainer>
    </ContactPage>
  );
};

export default Contact;