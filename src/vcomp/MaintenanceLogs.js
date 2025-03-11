import React, { useState } from "react";
import styled from "styled-components";
import VehicleMaintenanceLogs from "./VeicleMaintenanceLogs";

const LogsContainer = styled.div`
  width: 350px;
  padding: 40px;
  background-color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 100%;
  font-size: 2em;
  
`;

const LogItem = styled.div`
  background-color:rgb(255, 255, 255);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 90%;
  text-align: left;
`;

const LogDate = styled.span`
  font-weight: bold; // Add styling for LogDate here
`;

const LogDescription = styled.span`
  // Add styling for LogDescription here
`;

const ViewAllButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  transition: transform 0.3s ease;

  &:hover {
  transform: scale(1.1); // Enlargen on hover
`;

const MaintenanceLogs = ({ logs }) => {
  const [logsData] = useState([
    { id: 1, date: "02/12/25", description: "Oil Change" },
    { id: 2, date: "02/05/25", description: "Wrap" },
    { id: 3, date: "01/25/25", description: "Battery" },
  ]);
  
  const [showLogs, setShowLogs] = useState(false); // Define showLogs and setShowLogs


  return (
    <LogsContainer>
      <Title>| ALL LOGS</Title>
      {logsData.map((log) => (
        <LogItem key={log.id}>
          <LogDate>{log.date}</LogDate> {/* Render LogDate */}
          <LogDescription>{log.description}</LogDescription> {/* Render LogDescription */}
        </LogItem>
      ))}
        <ViewAllButtonContainer> {/* Use a container with onClick */}
        <button onClick={() => setShowLogs(true)}>VIEW ALL</button>
      </ViewAllButtonContainer>

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

export default MaintenanceLogs;