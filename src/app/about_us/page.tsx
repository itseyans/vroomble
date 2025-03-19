"use client";

import React from "react";
import styled from "styled-components";

const AboutPage = styled.div`
  background-color: #131415;
  color: gold;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
`;

const TeamTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const DevelopersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const DeveloperSection = styled.div`
  background-color: #242424;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin: 0 auto 1rem;
  overflow: hidden;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
`;

const Name = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const About: React.FC = () => {
  interface Developer {
    name: string;
  }

  const developers: Developer[] = [
    { name: "Bryan Anthony Al Shadani" },
    { name: "Francis Joseph Libres" },
    { name: "Hanz Ian Silva" },
    { name: "Kim Miguel Sobrepena" },
  ];

  return (
    <AboutPage>
      <TeamTitle>Our Team</TeamTitle>
      <DevelopersContainer>
        {developers.map((developer, index) => (
          <DeveloperSection key={index}>
            <ImageContainer>
              <ImagePlaceholder />
            </ImageContainer>
            <Name>{developer.name}</Name>
          </DeveloperSection>
        ))}
      </DevelopersContainer>
    </AboutPage>
  );
};

export default About;