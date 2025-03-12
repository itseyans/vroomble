"use client";

import React from "react";
import styled from "styled-components";
import GeneralNavBar from "../../vcomp/GeneralNavBar"; // Adjust the path as needed
import MaintenanceContainer from "../../vcomp/maintenancepage components/MaintenanceContainer"; // Adjust the path as needed

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
      <GeneralNavBar />
      <ContentContainer>
        <MaintenanceContainer />
      </ContentContainer>
    </PageContainer>
  );
};

export default MaintenancePage;

//gegeg