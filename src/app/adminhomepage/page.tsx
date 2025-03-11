"use client";

import React from "react";
import styled from "styled-components";
import AdminNavBar from "../../vcomp/AdminNavBar"; // ✅ Using AdminNavBar

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh; 
  display: flex;
  flex-direction: column; 
`;

const VehicleRegistrationPage = () => {
  return (
    <PageContainer>
      <AdminNavBar /> 
    </PageContainer>
  );
};

export default VehicleRegistrationPage;
