"use client";

import React, { useState } from "react";
import styled from "styled-components";
import MaintenanceLogsPopUp from "@/vcomp/MaintenanceLogsPopUp";

//  Main Container (Updated Height to 600px)
const CardContainer = styled.div`
  background-color: #d9d9d9;
  padding: 12px;
  border: 5px solid #ffc629;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
  width: 600px;
  height: 185px; /*  Fixed Height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

//  Header Section
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  padding-bottom: 10px;
`;

//  View All Button
const ViewAllButton = styled.button`
  background-color: #ffc629;
  font-weight: bold;
  color: black;
  padding: 10px 12px;
  width: 150px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  align-self: center; /*  Ensures button stays centered */

  &:hover {
    transform: scale(1.05);
  }
`;

//  Logs Container (Scrollable for More Data)
const LogsContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  flex-grow: 1;
  overflow-y: auto;
`;

//  Log Row
const LogRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 5px 0;
  font-weight: bold;
`;

//  Utility Function to Truncate Text
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

//  Sample Maintenance Logs Data
const logs = [
  { date: "01/25/2025", change: "Tire Change", vehicle: "LEXUS LC 500", cost: "PHP 500" },
  { date: "02/06/2025", change: "Change Oil", vehicle: "LB HURACAN STO", cost: "PHP 800" },
  { date: "03/10/2025", change: "Brake Pads", vehicle: "NISSAN GTR", cost: "PHP 1200" },
  { date: "04/12/2025", change: "New Battery", vehicle: "FORD MUSTANG", cost: "PHP 950" },
];

const MaintenanceLogsHome = () => {
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <>
      {/*  Main Card */}
      <CardContainer>
        <Header>
          <span>MAINTENANCE LOGS</span>
        </Header>

        {/*  Logs Preview */}
        <LogsContainer>
          {logs.map((log, index) => (
            <LogRow key={index}>
              <span>{log.date}</span>
              <span>{truncateText(log.change, 10)}</span>
              <span>{truncateText(log.vehicle, 10)}</span>
              <span>{log.cost}</span>
            </LogRow>
          ))}
        </LogsContainer>

        {/*  View All Button */}
        <ViewAllButton onClick={() => setShowPopUp(true)}>VIEW ALL</ViewAllButton>
      </CardContainer>

      {/*  Pop-Up (Only shows when triggered) */}
      {showPopUp && <MaintenanceLogsPopUp onClose={() => setShowPopUp(false)} />}
    </>
  );
};

export default MaintenanceLogsHome;
