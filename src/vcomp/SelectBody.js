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
  font-weight: bold;
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

const BODY_TYPES = [
  "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Fastback",
  "SUV", "Crossover", "Pickup Truck", "Off-Road Vehicle", "Van", "Minivan (MPV)",
  "Supercar", "Roadster", "Muscle Car", "Luxury Car",
  "Pickup-Based SUV", "Microcar / Kei Car", "Panel Van", "Box Truck / Lorry",
  "Bus / Coach", "Flatbed Truck", "Chassis Cab"
];

const SelectBody = () => {
  const [selectedBody, setSelectedBody] = useState("SELECT BODY TYPE");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBodies, setFilteredBodies] = useState(BODY_TYPES);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredBodies(BODY_TYPES.filter((type) => type.toUpperCase().includes(value)));
  };

  const handleSelect = (bodyType) => {
    setSelectedBody(bodyType);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedBody} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          <input
            type="text"
            placeholder="Search body type..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", boxSizing: "border-box" }}
          />
          {filteredBodies.length > 0 ? (
            filteredBodies.map((type, index) => (
              <DropdownItem key={index} onClick={() => handleSelect(type)}>
                {type}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem>No results found</DropdownItem>
          )}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SelectBody;
