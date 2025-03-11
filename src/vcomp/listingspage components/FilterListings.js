"use client";

import React, { useState } from "react";
import styled from "styled-components";
import GeneralButton from "@/vcomp/GeneralButton";
import SelectBody from "@/vcomp/SelectBody";
import SelectBrand from "@/vcomp/SelectBrand";

// ✅ Main Filter Container (Now Horizontal)
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #d9d9d9;
  border: 4px solid #ffc629;
  border-radius: 12px;
  padding: 10px 20px;
  width: 100%;
  max-width: 1100px;
  gap: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI Variable", sans-serif;
`;

// ✅ Apply Button
const ApplyButton = styled(GeneralButton)`
  padding: 10px 20px;
  font-size: 1rem;
  background: white;
  color: black;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// ✅ Search Input Container
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid black;
  border-radius: 8px;
  padding: 5px 10px;
  width: 250px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: "Segoe UI Variable", sans-serif;
  color: black;
  background: transparent;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
`;

// ✅ Price Range Container
const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: black;
  font-size: 0.9rem;
  font-weight: bold;
`;

// ✅ Price Slider
const PriceSlider = styled.input`
  width: 160px;
  -webkit-appearance: none;
  height: 6px;
  background: black;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
`;

// ✅ Dropdown Button (Body Type & Brand)
const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  color: black;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 8px;
  padding: 10px 20px;
  width: 180px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const FilterListings = () => {
  const [price, setPrice] = useState(10000000);

  return (
    <FilterContainer>
      {/* ✅ Apply Button */}
      <ApplyButton>APPLY</ApplyButton>

      {/* ✅ Search Bar */}
      <SearchContainer>
        <SearchInput type="text" placeholder="SEARCH" />
        <ClearButton>✕</ClearButton>
      </SearchContainer>

      {/* ✅ Price Range Slider */}
      <PriceRangeContainer>
        <span>PRICE RANGE</span>
        <PriceSlider
          type="range"
          min="0"
          max="10000000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <span>₱0 - ₱{price}+</span>
      </PriceRangeContainer>

      {/* ✅ Dropdowns */}
      <DropdownButton>
        Body Type ▼
      </DropdownButton>

      <DropdownButton>
        Brand ▼
      </DropdownButton>
    </FilterContainer>
  );
};

export default FilterListings;
