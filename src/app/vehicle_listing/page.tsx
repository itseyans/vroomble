"use client";

import React from "react";
import styled from "styled-components";
import GeneralNavBar from "@/vcomp/GeneralNavBar"; // ✅ Nav Bar
import FilterListings from "@/vcomp/listingspage components/FilterListings"; // ✅ Filter Bar
import ListingCard from "@/vcomp/ListingCard"; // ✅ Vehicle Listings

// ✅ Page Container
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  padding-top: 9rem; /* ✅ Pushes content BELOW navbar */
`;

// ✅ Filter Bar Wrapper (Centered & Spaced Below Navbar)
const FilterListingsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 3rem; /* ✅ Increased spacing below FilterListings */
`;

// ✅ Vehicle Listings Grid (Centered)
const VehicleGridContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center; /* ✅ Ensures grid stays in center */
  align-items: center;
  margin: 0 auto; /* ✅ Forces proper centering */
`;

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 20px;
  width: 90%; /* ✅ Keeps grid from stretching too far */
  max-width: 1200px; /* ✅ Ensures grid is properly contained */
  justify-content: center; /* ✅ Ensures grid items are centered */
`;

// ✅ Pagination Controls
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

// ✅ Pagination Buttons
const PaginationButton = styled.button`
  background-color: #ffc629;
  color: black;
  font-weight: bold;
  padding: 15px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function VehicleListing() {
  return (
    <PageContainer>
      {/* ✅ Navbar */}
      <GeneralNavBar />

      {/* ✅ Filter Bar with Extra Spacing */}
      <FilterListingsWrapper>
        <FilterListings />
      </FilterListingsWrapper>

      {/* ✅ Centered Vehicle Listings Grid */}
      <VehicleGridContainer>
        <VehicleGrid>
          <ListingCard />
          <ListingCard />
          <ListingCard />
          <ListingCard />
          <ListingCard />
          <ListingCard />
          <ListingCard />
          <ListingCard />
        </VehicleGrid>
      </VehicleGridContainer>

      <PaginationContainer>
        <PaginationButton>⬅</PaginationButton>
        <PaginationButton>➡</PaginationButton>
      </PaginationContainer>
    </PageContainer>
  );
}


