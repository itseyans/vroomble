import React, { useState, useEffect } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: 300px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 6px 12px; /* Reduced padding to compensate for larger text */
  font-size: 24px; /* Increased font size */
  border: 3px solid #ccc;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    border-color: #999;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    border-color: #666;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
    outline: none;
  }
`;



const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  background: white;
  border: 3px solid #ccc; /* Match the 3px thickness */
  border-radius: 12px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  list-style: none;
  padding: 0;
  z-index: 10;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
`;

const DropdownItem = styled.li`
  padding: 10px;
  text-align: left; /* Left-align text */
  cursor: pointer;
  border-radius: 12px; /* Rounded corners */
  max-width: 100%; /* Prevent text overflow */
  overflow-x: hidden; /* Hide any horizontal overflow */

  &:hover {
    background: #ffc629;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  border-radius: 12px; /* Rounded corners */
  box-sizing: border-box; /* Ensure padding doesn't increase width */

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
      setFilteredVehicles(data); // Initialize filtered list
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
