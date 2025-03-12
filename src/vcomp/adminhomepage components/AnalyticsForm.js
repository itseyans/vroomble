"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, LineChart, Line
} from "recharts";

const AnalyticsForm = () => {
  const [activeChart, setActiveChart] = useState("carMaker");
  const [carMakerData, setCarMakerData] = useState([]);
  const [bodyTypeData, setBodyTypeData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/car-maker-stats")
      .then((response) => response.json())
      .then((data) => setCarMakerData(data));

    fetch("http://localhost:8000/body-type-distribution")
      .then((response) => response.json())
      .then((data) => setBodyTypeData(data));

    fetch("http://localhost:8000/yearly-registrations")
      .then((response) => response.json())
      .then((data) => setYearlyData(data));

    fetch("http://localhost:8000/fuel-type-distribution")
      .then((response) => response.json())
      .then((data) => setFuelTypeData(data));
  }, []);

  return (
    <div className="w-[1400px] h-[750px] bg-gray-100 p-6 mx-auto rounded-lg shadow-lg">
      <div className="flex justify-center space-x-4 mb-6">
        <button className={`px-4 py-2 rounded-md ${activeChart === "carMaker" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => setActiveChart("carMaker")}>Car Maker</button>
        <button className={`px-4 py-2 rounded-md ${activeChart === "bodyType" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => setActiveChart("bodyType")}>Vehicle Type</button>
        <button className={`px-4 py-2 rounded-md ${activeChart === "yearly" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => setActiveChart("yearly")}>Yearly Registrations</button>
        <button className={`px-4 py-2 rounded-md ${activeChart === "fuelType" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => setActiveChart("fuelType")}>Fuel Type</button>
      </div>

      <div className="w-full h-[500px] bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        {activeChart === "carMaker" && (
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

        {activeChart === "bodyType" && (
          <ResponsiveContainer width="90%" height="90%">
            <PieChart>
              <Pie data={bodyTypeData} dataKey="count" nameKey="body_type" outerRadius={120} fill="#8884d8" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === "yearly" && (
          <ResponsiveContainer width="90%" height="90%">
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "fuelType" && (
          <ResponsiveContainer width="90%" height="90%">
            <PieChart>
              <Pie data={fuelTypeData} dataKey="count" nameKey="fuel_type" outerRadius={120} fill="#82ca9d" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsForm;
