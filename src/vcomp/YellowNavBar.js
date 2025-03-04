import React from "react";
import styled from "styled-components";

// Import your icon images (replace with actual paths)
import carIcon from "../images/caricon.png";
import vehicleIcon from "../images/caricon.png"; 
import userIcon from "../images/usericon.png";
import sellerIcon from "../images/usericon.png";

const NavBarContainer = styled.nav`
  background-color: #ffc629;
  color: black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem; /* Reduced padding for closer spacing */
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 0.75rem; /* Reduced padding inside NavItem */
  width: 180px; /* Adjusted width for better spacing */
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
  width: 50px;
  height: 50px;
`;

const YellowNavBar = () => {
  const users = 100;
  const vehicles = 50;
  const registeredCars = 200;
  const sellers = 20;

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