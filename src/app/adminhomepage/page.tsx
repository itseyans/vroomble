"use client";

import React from "react";
import styled from "styled-components";
import AdminNavBar from "../../vcomp/AdminNavBar";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex; /* ✅ Makes Left & Right containers sit side by side */
  align-items: flex-start;
  justify-content: space-between;
  width: 90%; /* Adjust width as needed */
  max-width: 1300px; /* Prevents content from being too wide */
  margin-top: 10rem; /* ✅ Pushes below navbar */
`;

const LeftContainer = styled.div`
  max-width: 300px;
  width: 100%;
  min-height: 700px; /* Adjust as needed */
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
`;

const RightContainer = styled.div`
  max-width: 1500px;
  width: 100%;
  min-height: 700px; /* Adjust as needed */
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
`;

const AdminHomepage = () => {
  return (
    <PageContainer>
      <AdminNavBar />
      
      {/* ✅ Wrapper to keep containers side by side */}
      <ContentWrapper>
        <LeftContainer>
          <h2>Left Panel</h2>
          <p>Content goes here...</p>
        </LeftContainer>

        <RightContainer>
          <h1>Right Panel</h1>
        </RightContainer>
      </ContentWrapper>
      
    </PageContainer>
  );
};

export default AdminHomepage;
