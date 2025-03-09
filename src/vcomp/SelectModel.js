import React, { useState, useEffect } from "react";
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

const MODELS = {
  "Mazda": [
    "MX-5 Miata",
    "CX-5",
    "Mazda3",
    "Mazda6",
    "CX-3",
    "CX-30",
    "CX-9",
    // Add more Mazda models
  ],
  "Toyota": [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Tacoma",
    "Tundra",
    "Prius",
    // Add more Toyota models
  ],
  // Add more brands and their models
};

const SelectModel = ({ brand, value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    if (brand && MODELS[brand]) {
      setFilteredModels(MODELS[brand]);
    } else {
      setFilteredModels([]);
    }
  }, [brand]);

  const displayValue = value || "SELECT MODEL";

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    if (brand && MODELS[brand]) {
      setFilteredModels(
        MODELS[brand].filter((model) => model.toUpperCase().includes(value))
      );
    } else {
      setFilteredModels([]);
    }
  };

  const handleSelect = (model) => {
    setIsOpen(false);
    setSearchTerm("");
    onChange({
      target: {
        name: name,
        value: model,
      },
    });
  };

  return (
    <DropdownContainer>
      <DropdownButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ color: value ? "black" : "#666" }}>
          {displayValue}
        </span>
        {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList role="listbox">
          <SearchInput
            type="text"
            placeholder="Search model..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search models"
          />
          {filteredModels && filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <DropdownItem
                key={model}
                onClick={() => handleSelect(model)}
                role="option"
                aria-selected={model === value}
              >
                {model}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem role="option">No results found</DropdownItem>
          )}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default SelectModel;