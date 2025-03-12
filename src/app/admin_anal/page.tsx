"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import AdminNavBar from "../../vcomp/AdminNavBar";

// Dynamically import AnalyticsPage to prevent SSR issues
const AnalyticsPage = dynamic(() => import("../../vcomp/AnalyticsPage"), { ssr: false });

const PageContainer = styled.div`
  width: 100%;  
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <AdminNavBar />
      <AnalyticsPage />
    </PageContainer>
  );
};

export default Page;