"use client";
import React, { useState, useEffect } from "react";

const PersoInfoCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Loading...");
  const [contactNumber, setContactNumber] = useState("Loading...");
  const [region, setRegion] = useState("Loading...");
  const [vehicleCount, setVehicleCount] = useState(0); //  Vehicle count is NOT stored in the token, needs API call

  //  Fetch User Data from JWT Token (Stored in Cookies)
  useEffect(() => {
    fetch("http://localhost:8000/user/me", {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
    })
      .then((response) => response.json())
      .then((data) => {
        setName(`${data.firstName} ${data.lastName}`);
        setContactNumber(data.contactNumber);
        setRegion(data.region);
      })
      .catch((error) => console.error("Error fetching user data:", error));

    //  Fetch Vehicle Count Separately (If stored in a different table)
fetch("http://localhost:8004/user/vehicle-count", {
  method: "GET",
  credentials: "include",
})
.then((response) => response.json())
.then((data) => setVehicleCount(data.vehicle_count)) //  Using correct key
.catch((error) => console.error("Error fetching vehicle count:", error));

  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    fetch("http://localhost:8000/user/update-region", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region }),
    })
      .then((response) => {
        if (response.ok) {
          setIsEditing(false);
          console.log("Region updated successfully:", region);
        } else {
          console.error("Failed to update region");
        }
      })
      .catch((error) => console.error("Error updating region:", error));
  };

  //  Styling Definitions
  const cardStyle = {
    width: "600px",
    minHeight: "450px", //  Adjust to match right container
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    border: "5px solid gold",
    borderRadius: "10px",
    backgroundColor: "#D9D9D9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI Variable', sans-serif",
    color: "black",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const displayInfoStyle = {
    backgroundColor: "#FFFFFF",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    color: "black",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
  };

  const buttonStyle = {
    backgroundColor: "gold",
    padding: "10px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    width: "80%",
    display: "block",
    margin: "0 auto",
    fontWeight: "bold",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
        PERSONAL INFORMATION
      </h2>

      {/*  Display Name (Read-Only) */}
      <div style={displayInfoStyle}>
        <strong>NAME:</strong> &nbsp; {name}
      </div>

      {/*  Display Contact Number (Read-Only) */}
      <div style={displayInfoStyle}>
        <strong>CONTACT NUMBER:</strong> &nbsp; {contactNumber}
      </div>

      {/*  Display Vehicle Count (Read-Only) */}
      <div style={displayInfoStyle}>
       <strong>VEHICLE COUNT:</strong> &nbsp; {vehicleCount > 0 ? vehicleCount : "No vehicles registered"}
      </div>


      {isEditing ? (
        <div>
          {/*  General Region (Editable) */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ color: "black" }}>General Region:</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/*  Save Button */}
          <button 
            onClick={handleSaveClick} 
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Save Region
          </button>
        </div>
      ) : (
        <div>
          {/* Display General Region */}
          <div style={displayInfoStyle}>
            <strong>GENERAL REGION:</strong> &nbsp; {region}
          </div>

          {/*  Edit Button */}
          <button 
            onClick={handleEditClick} 
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            EDIT REGION
          </button>
        </div>
      )}
    </div>
  );
};

export default PersoInfoCard;