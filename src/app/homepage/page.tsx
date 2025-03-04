"use client";

import NavBar from "../../vcomp/NavBar";
import YellowNavBarContent from "../../vcomp/YellowNavBarContent";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  display: flex;
  flex-direction: column;
  background-color:rgb(11, 8, 8); /* Or whatever background you want */
`;

const ContentContainer = styled.div`
  flex-grow: 1; /* Allow content to take up remaining space */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  padding: 2rem;
`;

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <YellowNavBarContent />
      <ContentContainer>
        <h1>Welcome to the Home Page!</h1>
        {/* ... other content ... */}
      </ContentContainer>
    </PageContainer>
  );
}