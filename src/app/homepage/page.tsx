"use client";

import React from "react"; // ✅ Import React
import styled from "styled-components";
import HomeNav from "@/vcomp/HomeNav";
import PersoInfoH from "@/vcomp/PersoInfoH"; // ✅ Import Personal Info Panel

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem; /* ✅ Prevent overlap with navbar */
`;

const Home: React.FC = () => {
  return (
    <PageContainer>
      {/* ✅ Navbar */}
      <HomeNav />

      {/* ✅ Content Section */}
      <ContentContainer>
        <PersoInfoH /> {/* ✅ Personal Information Panel */}
      </ContentContainer>
    </PageContainer>
  );
};

export default Home;
