"use client";
import React, { useState } from "react";

const PersoInfoH = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Temp Name");
  const [age, setAge] = useState(21);
  const [region, setRegion] = useState("Philippines");
  const [vehicleCount, setVehicleCount] = useState(1);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log("Saved:", { name, age, region, vehicleCount });
  };

  return (
    <div
      style={{
        width: "clamp(500px, 80%, 800px)",
        padding: "20px",
        border: "5px solid gold",
        borderRadius: "10px",
        backgroundColor: "#D9D9D9", // ✅ Changed Background to #D9D9D9
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Segoe UI Variable', sans-serif",
        color: "black",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <div
          style={{
            width: "4px",
            height: "20px",
            backgroundColor: "#333",
            marginRight: "10px",
          }}
        ></div>
      <h2 style={{ margin: 0, color: "black", fontWeight: "bold" }}>PERSONAL INFORMATION</h2>
      </div>

      {isEditing ? (
        <div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "black" }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                fontFamily: "'Segoe UI Variable', sans-serif",
                color: "black",
                backgroundColor: "#FFFFFF", // ✅ Changed Input Fields to White
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "black" }}>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                fontFamily: "'Segoe UI Variable', sans-serif",
                color: "black",
                backgroundColor: "#FFFFFF", // ✅ Changed Input Fields to White
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "black" }}>General Region:</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                fontFamily: "'Segoe UI Variable', sans-serif",
                color: "black",
                backgroundColor: "#FFFFFF", // ✅ Changed Input Fields to White
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "black" }}>Vehicle Count:</label>
            <input
              type="number"
              value={vehicleCount}
              onChange={(e) => setVehicleCount(parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                fontFamily: "'Segoe UI Variable', sans-serif",
                color: "black",
                backgroundColor: "#FFFFFF", // ✅ Changed Input Fields to White
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            onClick={handleSaveClick}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              width: "100%",
              fontFamily: "'Segoe UI Variable', sans-serif",
            }}
          >
            Save Information
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              backgroundColor: "#FFFFFF", // ✅ Changed Display Containers to White
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              color: "black",
              fontFamily: "'Segoe UI Variable', sans-serif",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow to display containers
            }}
          >
            <strong>NAME:</strong> {name}
          </div>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              color: "black",
              fontFamily: "'Segoe UI Variable', sans-serif",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <strong>AGE:</strong> {age}
          </div>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              color: "black",
              fontFamily: "'Segoe UI Variable', sans-serif",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <strong>GENERAL REGION:</strong> {region}
          </div>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              color: "black",
              fontFamily: "'Segoe UI Variable', sans-serif",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // ✅ Added dropdown shadow to display containers
            }}
          >
            <strong>VEHICLE COUNT:</strong> {vehicleCount}
          </div>
          <button
  onClick={handleEditClick}
  style={{
    backgroundColor: "gold",
    padding: "10px 15px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    width: "80%",  // ✅ Adjusted width
    fontFamily: "'Segoe UI Variable', sans-serif",
    color: "black",
    fontWeight: "bold",
    transition: "transform 0.2s ease-in-out",
    display: "block",  // ✅ Makes it a block element
    margin: "0 auto",  // ✅ Centers the button horizontally
    textAlign: "center", // ✅ Ensures text stays centered
  }}
  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
>
  EDIT INFORMATION
</button>


        </div>
      )}
    </div>
  );
};

export default PersoInfoH;