"use client";

import WelcomeNavBar from "../vcomp/landingpage components/WelcomeNavBar";
import ListingCard from "../vcomp/ListingCard"; /*ListingCard */
import Background from "../vcomp/background";
import styled from "styled-components";

const ListingContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px; /* Increased spacing between cards */
  margin-top: 40px; /* Slightly increased spacing below YellowNavBar */
  flex-wrap: wrap; /* Ensure responsiveness */
`;
//asdasd
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <WelcomeNavBar /> {/* Now contains the yellow section too */}
      <ListingContainer>
        {/* Dynamically render 4 Listing Cards */}
        <ListingCard carName="Database - Car Name" imageUrl="Image From Database" dateListed="Date listed - Database" />
        <ListingCard carName="Database - Car Name" imageUrl="Image From Database" dateListed="Date listed - Database" />
        <ListingCard carName="Database - Car Name" imageUrl="Image From Database" dateListed="Date listed - Database" />
        <ListingCard carName="Database - Car Name" imageUrl="Image From Database" dateListed="Date listed - Database" />
      </ListingContainer>
  
      <footer className="flex gap-6 flex-wrap items-center justify-center p-4"></footer>
       
       
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
