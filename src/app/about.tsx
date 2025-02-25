
import React from "react";
import styled from "styled-components";

const AboutPage = styled.div`
  background-color: #131415; /* Black background */
  color: gold;
  padding: 2rem;
  text-align: center;
  min-height: 100vh; /* Ensure page takes up full viewport height */
`;

const TeamTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const DevelopersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive columns */
  gap: 2rem;
`;

const DeveloperSection = styled.div`
  background-color: #242424; /* Slightly lighter black background for sections */
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e0e0e0; /* Light grey placeholder background */
  margin: 0 auto 1rem; /* Center the image and add space below */
  overflow: hidden; /* Ensure image doesn't overflow the circle */
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  /* You can add background images or icons here as placeholders */
`;

const Name = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const About: React.FC = () => {
  // Define the type for the developer object
  interface Developer {
    name: string;
    // Add other properties like image URL, description, etc. if needed
  }

  const developers: Developer[] = [
                              { name: "Cedric John Cangco" },
                              { name: "Francis Joseph Libres" },
                              { name: "Juan Miguel Molina" },
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
            {/* Add space for description or other details */}
          </DeveloperSection>
        ))}
      </DevelopersContainer>
    </AboutPage>
  );
};

export default About;