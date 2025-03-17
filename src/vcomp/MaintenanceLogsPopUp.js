"use client";

import React from "react";
import styled from "styled-components";

//  Pop-up Container (Now 1000x800px)
const PopUpContainer = styled.div`
  width: 1000px;
  height: 800px;
  background-color: #F4F4F5;
  border: 5px solid #FFC629;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black; /* ✅ Ensures all text inside the pop-up is black */
`;

//  Header Section
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #D9D9D9;
  border-radius: 8px 8px 0 0;
  font-family: "Segoe UI Variable", sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
  color: black; /* ✅ Ensures header text is black */
`;

//  Close Button (Red)
const CloseButton = styled.button`
  background-color: #F66B6B;
  color: black;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

//  Table Container (Expanded to Fit New Size)
const TableContainer = styled.div`
  width: 95%;
  height: 85%;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  color: black; /* ✅ Ensures table text is black */
`;

//  Styled Table
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Segoe UI Variable", sans-serif;
  text-align: left;
  color: black; /* ✅ Ensures table text is black */
`;

//  Table Header
const TableHeader = styled.th`
  background-color: #D9D9D9;
  padding: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  color: black; /*  Ensures table headers are black */
`;

//  Table Data
const TableData = styled.td`
  padding: 15px;
  border-bottom: 2px solid #D9D9D9;
  font-size: 1.1rem;
  color: black; /*  Ensures table data is black */
`;

//  Sample Data (This should be replaced with actual dynamic data)
const maintenanceLogs = [
  { date: "01/25/2025", change: "Tire Change", vehicle: "LEXUS LC 500", cost: "PHP 500" },
  { date: "02/06/2025", change: "Change Oil", vehicle: "LB Huracan STO", cost: "PHP 800" },
];

const MaintenanceLogsPopUp = ({ onClose }) => {
  return (
    <PopUpContainer>
      {/*  Header */}
      <Header>
        <span>MAINTENANCE LOGS</span>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>

      {/*  Table */}
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader>DATE</TableHeader>
              <TableHeader>CHANGES</TableHeader>
              <TableHeader>VEHICLE</TableHeader>
              <TableHeader>COST</TableHeader>
            </tr>
          </thead>
          <tbody>
            {maintenanceLogs.map((log, index) => (
              <tr key={index}>
                <TableData>{log.date}</TableData>
                <TableData>{log.change}</TableData>
                <TableData>{log.vehicle}</TableData>
                <TableData>{log.cost}</TableData>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </PopUpContainer>
  );
};

export default MaintenanceLogsPopUp;
