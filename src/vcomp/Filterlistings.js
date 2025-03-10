// Filterlistings.js (Vertical Popup Version)

import React, { useState } from "react";
import styled from "styled-components";
import GeneralButton from "../vcomp/GeneralButton";
import SelectBody from "../vcomp/SelectBody";
import SelectBrand from "../vcomp/SelectBrand";

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column; // Vertical layout
  background: #d9d9d9;
  border: 4px solid #ffc629;
  border-radius: 12px;
  padding: 40px;
  width: 400px; // Adjust width as needed
  gap: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Add a shadow for popup effect
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  width: 100%; // Take full width
`;

const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column; // Vertical layout
  gap: 5px;
`;

const PriceSlider = styled.input`
  width: 100%; // Take full width
  -webkit-appearance: none;
  height: 6px;
  background: #ffc629;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column; // Vertical layout
  gap: 10px;
`;

const FilterListings = () => {
  const [price, setPrice] = useState(10000000);

  return (
    <FilterContainer>
      <GeneralButton>APPLY</GeneralButton>
      <SearchInput type="text" placeholder="SEARCH" />
      <PriceRangeContainer>
        <span>PRICE RANGE</span>
        <PriceSlider
          type="range"
          min="0"
          max="10000000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <span>₱{price}+</span>
      </PriceRangeContainer>
      <DropdownContainer>
        <SelectBody />
        <SelectBrand />
      </DropdownContainer>
    </FilterContainer>
  );
};

export default FilterListings;