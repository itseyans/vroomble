"use client";

import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export default function Home() {
  return (
    <PageContainer>
      <h1>Welcome to the Home Page!</h1>
    </PageContainer>
  );
}
