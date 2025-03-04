import React from "react";
import styled from "styled-components";

// Import your icon images (replace with actual paths)
import carIcon from "./caricon.png"; // Example: car-icon.png
import vehicleIcon from "./caricon.png"; // Example: vehicle-icon.png
import userIcon from "./usericon.png"; // Example: user-icon.png
import sellerIcon from "./usericon.png"; // Example: seller-icon.png

const NavBarContainer = styled.nav`
  background-color: #ffc629; /* Yellow background */
  color: black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0; /* Light gray box */
  border-radius: 10px;
  padding: 1rem;
  width: 200px; /* Adjust width as needed */
  text-align: center;
`;

const NavTitle = styled.span`
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const NavCount = styled.span`
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

const NavIcon = styled.img`
  width: 50px; /* Adjust icon size as needed */
  height: 50px;
`;

const YellowNavBar = ({ users, vehicles, registeredCars, sellers }) => {
  return (
    <NavBarContainer>
      <NavItem>
        <NavIcon src={carIcon} alt="Registered Cars" />
        <NavTitle>Registered Cars</NavTitle>
        <NavCount>{registeredCars}</NavCount>
      </NavItem>
      <NavItem>
        <NavIcon src={vehicleIcon} alt="Listed Vehicles" />
        <NavTitle>Listed Vehicles</NavTitle>
        <NavCount>{vehicles}</NavCount>
      </NavItem>
      <NavItem>
        <NavIcon src={userIcon} alt="Registered Users" />
        <NavTitle>Registered Users</NavTitle>
        <NavCount>{users}</NavCount>
      </NavItem>
      <NavItem>
        <NavIcon src={sellerIcon} alt="Registered Sellers" />
        <NavTitle>Registered Sellers</NavTitle>
        <NavCount>{sellers}</NavCount>
      </NavItem>
    </NavBarContainer>
  );
};

export default YellowNavBar;