"use client";
import React, { useState } from "react";

const PersoInfoH = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Bryan Anthony ");
  const [age, setAge] = useState(21);
  const [vehicleCount, setVehicleCount] = useState(5);
  const [region, setRegion] = useState("Metro Manila, Makati");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Here you would typically save the updated data to your backend
    console.log("Saved:", { name, age, vehicleCount, region });
  };

  return (
    <div
      style={{
        width: "350px", // Adjust as needed
        padding: "20px",
        border: "2px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <div
          style={{
            width: "4px",
            height: "20px",
            backgroundColor: "#333",
            marginRight: "10px",
          }}
        ></div>
        <h2 style={{ margin: 0 }}>PERSONAL INFORMATION</h2>
      </div>

      {isEditing ? (
        <div>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Vehicle Count:</label>
            <input
              type="number"
              value={vehicleCount}
              onChange={(e) => setVehicleCount(parseInt(e.target.value))}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>General Region:</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={handleSaveClick}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Save Information
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>NAME:</strong> {name}
          </div>
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>AGE:</strong> {age}
          </div>
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>VEHICLE COUNT:</strong> {vehicleCount}
          </div>
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
            }}
          >
            <strong>GENERAL REGION:</strong> {region}
          </div>
          <button
            onClick={handleEditClick}
            style={{
              backgroundColor: "gold",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            EDIT INFORMATION
          </button>
        </div>
      )}
    </div>
  );
};

export default PersoInfoH;