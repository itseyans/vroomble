// pages/maintenance.js (or whatever you name the file)

"use client"; // Assuming you're using Next.js App Router

import React from "react";
import styled from "styled-components";
import NavBar from "../../vcomp/landingpage components/LandingNavBar"; // Adjust the path as needed
import Background from "../../vcomp/background"; // Adjust the path as needed
import MaintenanceContainer from "../../vcomp/MaintenanceContainer"; // Adjust the path as needed

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; // Needed for Background to be absolute
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const MaintenancePage = () => {
  return (
    <PageContainer>
      <Background />
      <NavBar />
      <ContentContainer>
        <MaintenanceContainer />
      </ContentContainer>
    </PageContainer>
  );
};

export default MaintenancePage;