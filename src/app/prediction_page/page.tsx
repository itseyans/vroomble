"use client";

import React from "react";
import styled from "styled-components";
import Background from "../../vcomp/background";
import NavBar from "../../vcomp/GeneralNavBar"; // Use the correct import path
import PredictForm from "../../vcomp/PredictForm"; // ✅ Keep this
import GeneralButton from "../../vcomp/GeneralButton"; // Add if needed


/** Styled Components */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const ContentBox = styled.div`
  width: 450px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export default function Page() {
  return (
    <>
      <Background />
      <NavBar />
      <PageContainer>
        <ContentBox>
          <Title>Car Price Prediction</Title>
          <PredictForm /> {/* ✅ This now works properly */}
        </ContentBox>
      </PageContainer>
    </>
  );
}
