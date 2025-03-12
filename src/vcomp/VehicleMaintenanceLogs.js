
"use client";

import React from "react";
import styled from "styled-components";

const LForm = styled.div`
  padding: 20px;
  margin: 20px;
  background: #ddd;
  border: 5px solid #ffc629;
  border-radius: 10px;
  width: 400px; // Adjust width as needed
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const LogEntry = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const VehicleMaintenanceLogs = ({ onClose }) => {
  const maintenanceLogs = [
    { date: "01/25/2025", description: "Tire Change", vehicle: "LEXUS LC 500", cost: "$500" },
    { date: "02/06/2025", description: "Change Oil", vehicle: "LB Huracan STO", cost: "$800" },
    // Add more logs as needed
  ];

  return (
    <LForm>
      <Title>Vehicle Maintenance Logs</Title>
      {maintenanceLogs.map((log, index) => (
        <LogEntry key={index}>
          <span>{log.date}</span>
          <span>{log.description}</span>
          <span>{log.vehicle}</span>
          <span>{log.cost}</span>
        </LogEntry>
      ))}
      <center>
        <button
          onClick={onClose}
          style={{
            fontSize: "20px",
            color: "#131415",
            width: "155px",
            height: "35px",
            border: "2px solid #131415",
            borderRadius: "20px",
            transition: "background-color 0.3s",
            backgroundColor: "white",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#FFC629")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
        >
          Close
        </button>
      </center>
    </LForm>
  );
};

export default VehicleMaintenanceLogs;