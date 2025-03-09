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
  color: #000000;

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
  color: #000000;
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

const VehicleDropdown = ({ onSelect }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("SELECT VEHICLE");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch vehicles from API (port 8002)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const url = searchTerm
          ? `http://localhost:8002/api/vehicles?q=${searchTerm}`
          : "http://localhost:8002/api/vehicles";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch vehicles");

        const data = await response.json();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("❌ Error fetching vehicles:", error);
        setVehicles([]);
      }
    };

    fetchVehicles();
  }, [searchTerm]);

  // ✅ Filter search input (Now includes Year)
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredVehicles(
      vehicles.filter(
        (vehicle) =>
          vehicle.make.toUpperCase().includes(value) ||
          vehicle.model.toUpperCase().includes(value) ||
          (vehicle.variant && vehicle.variant.toUpperCase().includes(value)) ||
          vehicle.drivetrain.toUpperCase().includes(value) ||
          vehicle.year.toString().includes(value) // ✅ Added year filtering
      )
    );
  };

  // ✅ Handle selecting a vehicle
  const handleSelect = (vehicle) => {
    console.log("🚗 Selected Vehicle:", vehicle);
    console.log("🚗 Selected Vehicle CarID:", vehicle.CarID, typeof vehicle.CarID); // ⭐️ Log vehicle.CarID and its type
    setSelectedVehicle(`${vehicle.make} ${vehicle.model} (${vehicle.variant || "N/A"}) - ${vehicle.drivetrain} - ${vehicle.year}`);
    setIsOpen(false);
    setSearchTerm("");

    if (onSelect) {
      console.log("📡 Sending CarID to Parent Component:", vehicle.CarID);
      onSelect(vehicle.CarID);
    }
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
            filteredVehicles.map((vehicle) => (
              <DropdownItem key={vehicle.id} onClick={() => handleSelect(vehicle)}>
                {vehicle.make} {vehicle.model} ({vehicle.variant || "N/A"}) - {vehicle.drivetrain} - {vehicle.year}
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