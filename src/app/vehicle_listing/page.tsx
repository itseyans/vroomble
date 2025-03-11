// pages/listed-vehicles.js

"use client";

import React from "react";
import styled from "styled-components";
import LandingNavBar from "../../vcomp/landingpage components/LandingNavBar";
import FilterButton from "../../vcomp/FilterButton"; // Import FilterButton
import ListingCard from "../../vcomp/ListingCard"; //CAPITAL C

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  align-self: flex-start;
  margin-left: 2rem;
`;

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(335px, 1fr)); // 3 images per row
  gap: 20px;
  padding: 20px;
`;

const VehicleItem = styled.div`
  /* You can keep the styles here if you want to apply them to the ListingCard */
`;

const ListedVehiclesPage = () => {
  const vehicles = [
    {
      id: 1,
      name: "Car 1",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/BMW_330i_G20_IMG_0083.jpg/800px-BMW_330i_G20_IMG_0083.jpg",
    },
    {
      id: 2,
      name: "Car 2",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/2021_Mini_John_Cooper_Works_Countryman_front.jpg/800px-2021_Mini_John_Cooper_Works_Countryman_front.jpg",
    },
    {
      id: 3,
      name: "Car 3",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Peugeot_9X8_LMH_2022_Monza_front.jpg/800px-Peugeot_9X8_LMH_2022_Monza_front.jpg",
    },
    {
      id: 4,
      name: "Car 4",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/2020_Honda_Civic_Type_R_GT_Edition_front.jpg/800px-2020_Honda_Civic_Type_R_GT_Edition_front.jpg",
    },
  ];

  const handleClick = (vehicle: { name: string; image: string }) => {
    alert(`You clicked on ${vehicle.name}`);
  };
  

  return (
    <PageContainer>
      <LandingNavBar />
      <ContentContainer>
        <Title>LISTED VEHICLE VIEWING</Title>
        <FilterButton /> {/* Use FilterButton instead of FilterListings */}
        <VehicleGrid>
          {vehicles.map((vehicle) => (
            <VehicleItem key={vehicle.id} onClick={() => handleClick(vehicle)}>
              <ListingCard
                carName={vehicle.name}
                imageUrl={vehicle.image}
                dateListed="2 Weeks Ago"
              />
            </VehicleItem>
          ))}
        </VehicleGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ListedVehiclesPage;