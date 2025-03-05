"use client";

import NavBar from "../../vcomp/NavBar";
import Background from "../../vcomp/background"; // Ensure correct import
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(11, 8, 8);
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Background /> {/* Ensure this is rendered right after NavBar */}
      <ContentContainer>
        <h1>Welcome to the Home Page!</h1>
      </ContentContainer>
    </PageContainer>
  );
}