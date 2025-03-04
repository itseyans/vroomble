import React from "react";
import styled from "styled-components";

const LogsContainer = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  width: 100%;
`;

const LogItem = styled.div`
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 90%;
  text-align: left;
`;

const ViewAllButton = styled.button`
  background-color: #f0f0f0;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 30px; /* Added margin-top to create space */
`;

const MaintenanceLogs = ({ logs }) => {
  return (
    <LogsContainer>
      <Title>| ALL LOGS</Title>
      {logs.map((log, index) => (
        <LogItem key={index}>
          {log.date} {log.description}
        </LogItem>
      ))}
      <ViewAllButton>VIEW ALL</ViewAllButton>
    </LogsContainer>
  );
};

export default MaintenanceLogs;