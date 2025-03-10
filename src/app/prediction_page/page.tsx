"use client";
import React from "react";
import Background from "../../vcomp/background";
import NavBar from "../../vcomp/NavBar";
import styled from "styled-components";
import PredictForm from "../../vcomp/PredictForm";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const Header = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export default function Page() {
  return (
    <>
      <Background />
      <NavBar />
      <Container>
        <Header>Car Price Prediction</Header>
        <PredictForm />
      </Container>
    </>
  );
}
