"use client";

import React, { useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";

// Import components dynamically to prevent SSR
const AdminNavBar = dynamic(() => import("@/vcomp/AdminNavBar"), { ssr: false });
const AnalyticsForm = dynamic(() => import("@/vcomp/adminhomepage components/AnalyticsForm"), { ssr: false });
const AddVehicle = dynamic(() => import("@/vcomp/AddVehicle"), { ssr: false });
const AddPart = dynamic(() => import("@/vcomp/CarPartsRegistrationForm"), { ssr: false });
const UserVerificationForm = dynamic(() => import("@/vcomp/adminhomepage components/UserVerificationForm"), { ssr: false });
const ListingVerificationForm = dynamic(() => import("@/vcomp/adminhomepage components/ListingVerificationForm"), { ssr: false });
const DefaultContainerForm = dynamic(() => import("@/vcomp/adminhomepage components/DefaultContainerForm"), { ssr: false });
//lolomopanot
// Styled Components
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
  justify-content: center;
  width: 90%;
  max-width: 2000px;
  margin-top: 10rem;
  gap: 3rem;
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
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const AdminButtons = styled.button<{ $isDefault?: boolean }>`
  background-color: ${({ $isDefault }) => ($isDefault ? "#FFEE8C" : "#FFC629")};
  color: #131415;
  font-weight: bold;
  width: 95%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: #ffdb6d;
    transform: scale(1.05);
  }
`;

const AdminHomepage = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("default");

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
        <LeftContainer>
          <AdminButtons
            $isDefault={selectedComponent === "default"}
            onClick={() => setSelectedComponent("default")}
          >
            DEFAULT
          </AdminButtons>

          <AdminButtons
            $isDefault={selectedComponent === "analytics"}
            onClick={() => setSelectedComponent("analytics")}
          >
            ANALYSIS
          </AdminButtons>

          <AdminButtons
            $isDefault={selectedComponent === "vehicle_registration"}
            onClick={() => setSelectedComponent("vehicle_registration")}
          >
            VEHICLE REGISTRATION
          </AdminButtons>

          <AdminButtons
            $isDefault={selectedComponent === "part_registration"}
            onClick={() => setSelectedComponent("part_registration")}
          >
            PART REGISTRATION
          </AdminButtons>

          <AdminButtons
            $isDefault={selectedComponent === "user_verification"}
            onClick={() => setSelectedComponent("user_verification")}
          >
            USER VERIFICATION
          </AdminButtons>

          <AdminButtons
            $isDefault={selectedComponent === "listing_verification"}
            onClick={() => setSelectedComponent("listing_verification")}
          >
            LISTING VERIFICATION
          </AdminButtons>
        </LeftContainer>

        <RightContainer>{renderComponent()}</RightContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AdminHomepage;
