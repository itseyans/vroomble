"use client";

import React from "react";
import styled from "styled-components";
import AdminNavBar from "@/vcomp/AdminNavBar";
import AnalyticsForm from "@/vcomp/adminhomepage components/AnalyticsForm.js"

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center; /* ✅ Centers the containers horizontally */
  width: 90%; /* Adjust width as needed */
  max-width: 1300px; /* Prevents content from being too wide */
  margin-top: 10rem; /* ✅ Pushes below navbar */
  gap: 3rem; /* ✅ Equal spacing between left, right, and in between */
`;

const LeftContainer = styled.div`
  min-width: 300px;
  width: 100%;
  min-height: 750px;
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 20px; /* ✅ Added padding for better spacing */
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ Ensures buttons are centered */
  gap: 1rem; /* ✅ Provides spacing between buttons */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
`;

const RightContainer = styled.div`
  min-width: 1400px;
  width: 100%;
  min-height: 750px;
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
`;

const AdminButtons = styled.button`
  background-color: #FFC629;
  color: #131415;
  font-weight: bold;
  width: 95%; /* ✅ Ensures buttons are equal in width */
  padding: 1rem 1.5rem; /* ✅ Proper internal padding */
  font-size: 1.3rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #FFEE8C;
    transform: scale(1.05);
  }
`;

const AdminHomepage = () => {
  return (
    <PageContainer>
      <AdminNavBar />
      
      <ContentWrapper>
        <LeftContainer>
          <AdminButtons>ANALYSIS</AdminButtons>
          <AdminButtons>VEHICLE REGISTRATION</AdminButtons>
          <AdminButtons>PART REGISTRATION</AdminButtons>
          <AdminButtons>USER VERIFICATION</AdminButtons>
          <AdminButtons>LISTING VERIFICATION</AdminButtons>
        </LeftContainer>

        <RightContainer>
          <AnalyticsForm />
        </RightContainer>
      </ContentWrapper>
      
    </PageContainer>
  );
};

export default AdminHomepage;
//testing