import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: 280px;
`;

const DropdownButton = styled.button`
  width: 330px;
  height: 55px;
  padding: 10px 20px; /* Adjusted padding */
  font-size: 20px;
  font-weight: bold; /* Ensuring bold text */
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center; /* Ensure everything stays in one line */
  align-items: center; /* Vertically center */
  gap: 10px; /* Adds space between text and arrow */
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  background: white;
  border: 2px solid #ccc;
  border-radius: 12px;
  margin-top: 5px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
  padding: 0;
  z-index: 10;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.li`
  padding: 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  max-width: 100%;
  overflow-x: hidden;

  &:hover {
    background: #ffc629;
  }
`;

const SelectTrans = () => {
  const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];
  const [selectedTransmission, setSelectedTransmission] = useState(
    "SELECT TRANSMISSION"
  );
  const [isOpen, setIsOpen] = useState(false);

  // Handle selecting a transmission type
  const handleSelect = (transmission) => {
    setSelectedTransmission(transmission);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedTransmission} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          {TRANSMISSION_OPTIONS.map((transmission, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleSelect(transmission)}
            >
              {transmission}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SelectTrans;
