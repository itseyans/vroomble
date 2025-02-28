import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: 280px;
`;

const DropdownButton = styled.button`
  width: 305px;
  height: 55px;
  padding: 20px;
  font-size: 20px;
  font-weight: bold; /* Ensuring bold text */
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const SelectFuel = () => {
  const FUEL_OPTIONS = ["Diesel", "Gasoline", "Electric"];
  const [selectedFuel, setSelectedFuel] = useState("SELECT FUEL");
  const [isOpen, setIsOpen] = useState(false);

  // Handle selecting a fuel type
  const handleSelect = (fuel) => {
    setSelectedFuel(fuel);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedFuel} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          {FUEL_OPTIONS.map((fuel, index) => (
            <DropdownItem key={index} onClick={() => handleSelect(fuel)}>
              {fuel}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SelectFuel;
