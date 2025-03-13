"use client"; 

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, LineChart, Line
} from "recharts";
import styled from "styled-components";

const RightContainer = styled.div`
  width: 1400px;
  height: 750px;
  background: #d9d9d9;
  padding: 20px;
  border-radius: 12px;
  border: 8px solid #ffc629;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffc629;
  transition: all 0.3s ease-in-out;
  &.active {
    background-color: #ffae00;
    color: white;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnalyticsForm = () => {
  const [activeChart, setActiveChart] = useState("carMaker");
  const [carMakerData, setCarMakerData] = useState(null);
  const [bodyTypeData, setBodyTypeData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [fuelTypeData, setFuelTypeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Promise.all([
          fetch("http://localhost:8000/car_maker_data"),
          fetch("http://localhost:8000/body-type-distribution"),
          fetch("http://localhost:8000/yearly-registrations"),
          fetch("http://localhost:8000/fuel-type-distribution"),
        ]);

        const data = await Promise.all(res.map((r) => r.json()));

        setCarMakerData(data[0]);
        setBodyTypeData(data[1]);
        setYearlyData(data[2]);
        setFuelTypeData(data[3]);

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <RightContainer>
      <NavButtons>
        <Button className={activeChart === "carMaker" ? "active" : ""} onClick={() => setActiveChart("carMaker")}>Car Maker</Button>
        <Button className={activeChart === "bodyType" ? "active" : ""} onClick={() => setActiveChart("bodyType")}>Vehicle Type</Button>
        <Button className={activeChart === "yearly" ? "active" : ""} onClick={() => setActiveChart("yearly")}>Yearly Registrations</Button>
        <Button className={activeChart === "fuelType" ? "active" : ""} onClick={() => setActiveChart("fuelType")}>Fuel Type</Button>
      </NavButtons>
      
      <ChartWrapper>
        {activeChart === "carMaker" && carMakerData && (
          <ResponsiveContainer width="90%" height="90%">
            <BarChart data={carMakerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="car_maker" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
        {activeChart === "bodyType" && bodyTypeData && (
          <ResponsiveContainer width="90%" height="90%">
            <PieChart>
              <Pie data={bodyTypeData} dataKey="count" nameKey="body_type" outerRadius={120} fill="#131415" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        {activeChart === "yearly" && yearlyData && (
          <ResponsiveContainer width="90%" height="90%">
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#131415" />
            </LineChart>
          </ResponsiveContainer>
        )}  
        {activeChart === "fuelType" && fuelTypeData && (
          <ResponsiveContainer width="90%" height="90%">
            <PieChart>
              <Pie data={fuelTypeData} dataKey="count" nameKey="fuel_type" outerRadius={120} fill="#131415" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartWrapper>
    </RightContainer>
  );
};
//reload
export default AnalyticsForm;
