import React, { useState } from "react";
import styled from "styled-components";
import GeneralButton from "./GeneralButton";
import SelectBody from "./SelectBody";
import SelectBrand from "./SelectBrand";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #d9d9d9;
  border: 4px solid #ffc629;
  border-radius: 12px;
  padding: 10px 40px;
  width: 100%;
  max-width: 1440px;
  gap: 5px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  width: 200px;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PriceSlider = styled.input`
  width: 150px;
  -webkit-appearance: none;
  height: 6px;
  background: #ffc629;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 40px; /* Increased gap for better spacing */
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
