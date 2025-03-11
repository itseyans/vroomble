// MaintenanceLogs.js (Homepage Version)
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import VehicleMaintenanceLogs from "./VeicleMaintenanceLogs"; // Assuming this is the correct path

const LogsContainer = styled.div`
  background-color: #e0e0e0;
  border: 4px solid #ffc629;
  border-radius: 12px;
  padding: 20px;
  width: 400px; // Adjust as needed
  font-family: 'Segoe UI Variable', sans-serif;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.5em;
  margin: 0;
`;

const ViewAllButton = styled.button`
  background-color: #ffc629;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const LogItem = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const HomeMaintenance = () => {
  const [showLogs, setShowLogs] = useState(false);
  const logsData = [
    { date: "01/25/2025", description: "Tire Change", vehicle: "LEXUS LC 500", cost: "$500" },
    { date: "02/06/2025", description: "Change Oil", vehicle: "LB Huracan STO", cost: "$800" },
  ];

  return (
    <LogsContainer>
      <TitleContainer>
        <Title>| MAINTENANCE LOGS</Title>
        <ViewAllButton onClick={() => setShowLogs(true)}>VIEW ALL</ViewAllButton>
      </TitleContainer>
      {logsData.map((log, index) => (
        <LogItem key={index}>
          <span>{log.date} {log.description} {log.vehicle}</span>
          <span>{log.cost}</span>
        </LogItem>
      ))}

      {showLogs && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}>
          <VehicleMaintenanceLogs onClose={() => setShowLogs(false)} />
        </div>
      )}
    </LogsContainer>
  );
};

export default HomeMaintenance;

