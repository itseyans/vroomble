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

const BRANDS = [
  "Abarth",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "BAIC",
  "Bentley",
  "BMW",
  "BYD",
  "Changan",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "Dongfeng",
  "Ferrari",
  "Fiat",
  "Ford",
  "Foton",
  "GAC",
  "Geely",
  "Great Wall",
  "Haima",
  "Haval",
  "Hino",
  "Honda",
  "Hyundai",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "JMC",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Porsche",
  "RAM",
  "Renault",
  "Rolls-Royce",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tata",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const SelectBrand = () => {
  const [selectedBrand, setSelectedBrand] = useState("SELECT BRAND");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(BRANDS);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setFilteredBrands(
      BRANDS.filter((brand) => brand.toUpperCase().includes(value))
    );
  };

  const handleSelect = (brand) => {
    setSelectedBrand(brand);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedBrand} {isOpen ? "▲" : "▼"}
      </DropdownButton>

      {isOpen && (
        <DropdownList>
          <SearchInput
            type="text"
            placeholder="Search brand..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand, index) => (
              <DropdownItem key={index} onClick={() => handleSelect(brand)}>
                {brand}
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

export default SelectBrand;
