"use client";

import React, { useState } from "react";
import styled from "styled-components";
import FilterListings from "../vcomp/Filterlistings"; // Adjust the path as needed

const FilterIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const FilterContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterListingsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10; // Ensure it appears above other elements
  display: ${({ showFilter }) => (showFilter ? "block" : "none")};
`;

const FilterButton = () => {
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setShowFilter(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FilterContainer>
      <FilterIcon
        src="/filtericon.png" // Replace with your filter icon path
        alt="Filter"
        onClick={toggleFilter}
      />
      <FilterListingsContainer showFilter={showFilter}>
        <FilterListings />
      </FilterListingsContainer>
    </FilterContainer>
  );
};

export default FilterButton;