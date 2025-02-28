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
  font-weight: 600;
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

  &:hover {
    background: #ffc629;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  border-radius: 12px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-bottom: 2px solid #ffc629;
  }
`;

// **Updated drivetrain options**
const DRIVETRAIN_OPTIONS = ["RWD", "FWD", "AWD", "4WD", "6WD", "8WD", "eAWD"];

const SelectDrive = () => {
  const [selectedDrivetrain, setSelectedDrivetrain] =
    useState("SELECT DRIVETRAIN");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(DRIVETRAIN_OPTIONS);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredOptions(
      DRIVETRAIN_OPTIONS.filter((option) => option.includes(value))
    );
  };

  // Handle selecting a drivetrain
  const handleSelect = (drivetrain) => {
    setSelectedDrivetrain(drivetrain);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedDrivetrain} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          <SearchInput
            type="text"
            placeholder="Search drivetrain..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <DropdownItem key={index} onClick={() => handleSelect(option)}>
                {option}
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

export default SelectDrive;
