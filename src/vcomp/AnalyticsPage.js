"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, LineChart, Line
} from "recharts";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  background-color: #f4f4f4;
`;

const ChartContainer = styled.div`
  width: 40%;
  height: 300px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  text-align: center;
  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ZoomContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ZoomedChart = styled.div`
  width: 70%;
  height: 70%;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
`;

const AnalyticsPage = () => {
  const [carMakerData, setCarMakerData] = useState([]);
  const [bodyTypeData, setBodyTypeData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [zoomedChart, setZoomedChart] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/car-maker-stats")
      .then((response) => response.json())
      .then((data) => setCarMakerData(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:8000/body-type-distribution")
      .then((response) => response.json())
      .then((data) => setBodyTypeData(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:8000/yearly-registrations")
      .then((response) => response.json())
      .then((data) => setYearlyData(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:8000/fuel-type-distribution")
      .then((response) => response.json())
      .then((data) => setFuelTypeData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <PageContainer>
      {zoomedChart && (
        <ZoomContainer onClick={() => setZoomedChart(null)}>
          <ZoomedChart>{zoomedChart}</ZoomedChart>
        </ZoomContainer>
      )}
      
      <ChartContainer onClick={() => setZoomedChart(
        <BarChart width={800} height={500} data={carMakerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="car_maker" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      )}>
        <Title>Car Maker Popularity</Title>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={carMakerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="car_maker" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ChartContainer onClick={() => setZoomedChart(
        <PieChart width={500} height={500}>
          <Pie data={bodyTypeData} dataKey="count" nameKey="body_type" outerRadius={150} fill="#8884d8" />
          <Tooltip />
          <Legend />
        </PieChart>
      )}>
        <Title>Vehicle Type Distribution</Title>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={bodyTypeData} dataKey="count" nameKey="body_type" outerRadius={100} fill="#8884d8" />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ChartContainer onClick={() => setZoomedChart(
        <LineChart width={800} height={500} data={yearlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#ff7300" />
        </LineChart>
      )}>
        <Title>Yearly Vehicle Registrations</Title>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ChartContainer onClick={() => setZoomedChart(
        <PieChart width={500} height={500}>
          <Pie data={fuelTypeData} dataKey="count" nameKey="fuel_type" outerRadius={150} fill="#82ca9d" />
          <Tooltip />
          <Legend />
        </PieChart>
      )}>
        <Title>Fuel Type Distribution</Title>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={fuelTypeData} dataKey="count" nameKey="fuel_type" outerRadius={100} fill="#82ca9d" />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </PageContainer>
  );
};

export default AnalyticsPage;