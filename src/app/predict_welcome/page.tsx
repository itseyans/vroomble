"use client";

import React from "react";
import styled from "styled-components";
import Background from "@/vcomp/background.js";
import WelcomeNavBar from "../../vcomp/landingpage components/WelcomeNavBar";
import PredictForm from "../../vcomp/PredictForm"; 

/** Styled Components */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 6rem; /*  Prevents navbar overlap */
`;
/** Title Box */
const TitleBox = styled.div`
  background-color: #d9d9d9; /*  Light gray background */
  border: 5px solid #ffc629; /*  Yellow stroke */
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px; /*  Spacing between title and PredictForm */
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
`;

/** Title Text */
const Title = styled.h2`
  color: black;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: "Segoe UI Variable", sans-serif;
  margin: 0;
`;

export default function Page() {
  return (
    <>
      <Background />
      <WelcomeNavBar />
      <PageContainer>
        {/*  Title Container */}
        <TitleBox>
          <Title>CAR BUILDER</Title>
        </TitleBox>

        {/* Prediction Form */}
        <PredictForm />
      </PageContainer>
    </>
  );
}