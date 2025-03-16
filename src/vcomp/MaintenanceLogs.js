"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VehicleMaintenanceLogs from "@/vcomp/VehicleMaintenanceLogs.js";

// ✅ Styled Components (No Changes)
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
  color: black;
`;

const LogItem = styled.div`
  background-color: rgb(255, 255, 255);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 90%;
  text-align: left;
  color: black;
`;

const LogDate = styled.span`
  font-weight: bold;
  color: black;
`;

const LogDescription = styled.span`
  color: black;
`;

const ViewAllButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  button {
    background-color: #ffc629;
    color: black;
    font-weight: bold;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background-color: #ffdf70;
    }
  }
`;

const MaintenanceLogs = ({ userRV_ID }) => {
  const [logsData, setLogsData] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://localhost:8005/api/get-maintenance-logs/?UserRV_ID=${userRV_ID}`);
        const data = await response.json();
        
        if (data.logs.length > 0) {
          setLogsData(data.logs);
        } else {
          setLogsData([]); // Show no logs if empty
        }
      } catch (error) {
        console.error("Error fetching maintenance logs:", error);
      }
    };

    if (userRV_ID) {
      fetchLogs();
    }
  }, [userRV_ID]);

  return (
    <LogsContainer>
      <Title>| ALL LOGS</Title>

      {logsData.length > 0 ? (
        logsData.map((log, index) => (
          <LogItem key={index}>
            <LogDate>{log.date}</LogDate> - <LogDescription>{log.change}</LogDescription>
          </LogItem>
        ))
      ) : (
        <p style={{ color: "gray" }}>No maintenance logs available.</p>
      )}

      <ViewAllButtonContainer>
        <button onClick={() => setShowLogs(true)}>VIEW ALL</button>
      </ViewAllButtonContainer>

      {showLogs && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <VehicleMaintenanceLogs logs={logsData} onClose={() => setShowLogs(false)} />
        </div>
      )}
    </LogsContainer>
  );
};

export default MaintenanceLogs;
