"use client";

import styled from "styled-components";
import GeneralNavBar from "@/vcomp/GeneralNavBar";
import PersoInfoCard from "@/vcomp/homepage components/PersoInfoCard";
import MaintenanceLogsHome from "@/vcomp/homepage components/MaintenanceLogsHome"; // ✅ Imported
import ManageVehiclesCard from "@/vcomp/homepage components/ManageVehiclesCard"; // ✅ Imported

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
  display: grid;
  grid-template-columns: 1fr 1fr; /* ✅ Two-column layout */
  gap: 2rem;
  margin-top: 8rem; /* ✅ Prevents overlap with navbar */
  width: 80%;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function Home() {
  return (
    <PageContainer>
      {/* ✅ Navbar */}
      <GeneralNavBar />

      {/* ✅ Content Section */}
      <ContentContainer>
        {/* ✅ Left Column: Personal Info + Maintenance Logs */}
        <LeftColumn>
          <PersoInfoCard />
          <MaintenanceLogsHome />
        </LeftColumn>

        {/* ✅ Right Column: Manage Vehicles */}
        <RightColumn>
          <ManageVehiclesCard />
        </RightColumn>
      </ContentContainer>
    </PageContainer>
  );
}