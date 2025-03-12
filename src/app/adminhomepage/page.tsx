"use client";

import React, { useState } from "react";
import styled from "styled-components";
import AdminNavBar from "@/vcomp/AdminNavBar";

// ✅ Import Components for Each Button
import AnalyticsForm from "@/vcomp/adminhomepage components/AnalyticsForm.js"; // Analysis
import AddVehicle from "@/vcomp/AddVehicle"; // Vehicle Registration
import AddPart from "@/vcomp/CarPartsRegistrationForm"; // Part Registration
import UserVerificationForm from "@/vcomp/adminhomepage components/UserVerificationForm"; // User Verification
import ListingVerificationForm from "@/vcomp/adminhomepage components/ListingVerificationForm"; // Listing Verification
import DefaultContainerForm from "@/vcomp/adminhomepage components/DefaultContainerForm"; // Default View

// ✅ Styled Components
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
  width: 90%;
  max-width: 2000px;
  margin-top: 10rem;
  gap: 3rem; /* ✅ Equal spacing between left, right, and in between */
`;

const LeftContainer = styled.div`
  min-width: 300px;
  width: 100%;
  min-height: 750px;
  background-color: #d9d9d9;
  border: 8px solid #ffc629;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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

const AdminButtons = styled.button<{ $isDefault?: boolean }>`
  background-color: ${({ $isDefault }) => ($isDefault ? "#FFEE8C" : "#FFC629")};
  color: #131415;
  font-weight: bold;
  width: 95%;
  padding: 1rem 1.5rem;
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


// ✅ Admin Homepage Component
const AdminHomepage = () => {
  // ✅ State to Track Selected Component
  const [selectedComponent, setSelectedComponent] = useState("default");

  // ✅ Function to Render the Selected Component
  const renderComponent = () => {
    switch (selectedComponent) {
      case "analytics":
        return <AnalyticsForm />;
      case "vehicle_registration":
        return <AddVehicle />;
      case "part_registration":
        return <AddPart />;
      case "user_verification":
        return <UserVerificationForm />;
      case "listing_verification":
        return <ListingVerificationForm />;
      default:
        return <DefaultContainerForm />;
    }
  };

  return (
    <PageContainer>
      <AdminNavBar />

      <ContentWrapper>
        {/* ✅ Left Panel with Navigation Buttons */}
        <LeftContainer>
          <AdminButtons 
            $isDefault={selectedComponent === "default"} 
            onClick={() => setSelectedComponent("default")}
          >
            DEFAULT
          </AdminButtons>

          <AdminButtons onClick={() => setSelectedComponent("analytics")}>
            ANALYSIS
          </AdminButtons>

          <AdminButtons onClick={() => setSelectedComponent("vehicle_registration")}>
            VEHICLE REGISTRATION
          </AdminButtons>

          <AdminButtons onClick={() => setSelectedComponent("part_registration")}>
            PART REGISTRATION
          </AdminButtons>

          <AdminButtons onClick={() => setSelectedComponent("user_verification")}>
            USER VERIFICATION
          </AdminButtons>

          <AdminButtons onClick={() => setSelectedComponent("listing_verification")}>
            LISTING VERIFICATION
          </AdminButtons>
        </LeftContainer>

        {/* ✅ Right Panel (Changes Dynamically) */}
        <RightContainer>
          {renderComponent()}
        </RightContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AdminHomepage;
