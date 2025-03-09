"use client";

import styled from "styled-components";
import HomeNav from "@/vcomp/HomeNav";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Adjust to prevent overlap */
  padding: 2rem;
`;

export default function Home() {
  return (
    <PageContainer>
      {/* ✅ Add Navbar at the Top */}
      <HomeNav />
      
      {/* ✅ Page Content */}
      <h1>Welcome to the Home Page!</h1>
    </PageContainer>
  );
}
