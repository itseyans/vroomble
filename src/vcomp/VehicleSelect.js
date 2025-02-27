import React, { useState, useEffect } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: 280px; /* Increased width for better balance */
`;

const DropdownButton = styled.button`
  width: 305px;
  height: 55px; /* Increased height for a perfect match */
  padding: 20px; /* Adjusted padding */
  font-size: 20px; /* Slightly larger text for better readability */
  font-weight: semi-bold;
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

const VehicleDropdown = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("SELECT VEHICLE");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulated API call to fetch vehicles from a database
  useEffect(() => {
    const fetchVehicles = async () => {
      const data = [
        "TOYOTA VIOS",
        "FORTUNER",
        "FORD RAPTOR",
        "FERRARI SF90",
        "LAMBORGHINI HURACAN",
        "MAZDA MIATA",
        "TOYOTA SUPRA",
        "TOYOTA 86",
        "SUBARU BRZ",
      ];
      setVehicles(data);
      setFilteredVehicles(data);
    };

    fetchVehicles();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredVehicles(vehicles.filter((vehicle) => vehicle.includes(value)));
  };

  // Handle selecting a vehicle
  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedVehicle} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          <SearchInput
            type="text"
            placeholder="Search vehicle..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle, index) => (
              <DropdownItem key={index} onClick={() => handleSelect(vehicle)}>
                {vehicle}
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

export default VehicleDropdown;
