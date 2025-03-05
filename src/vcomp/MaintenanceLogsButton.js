// MaintenanceLogsButton.js
import React from "react";
import GeneralButton from "./GeneralButton";

const MaintenanceLogsButton = ({ label, onClick }) => {
  return <GeneralButton onClick={onClick}>{label}</GeneralButton>;
};

export default MaintenanceLogsButton;