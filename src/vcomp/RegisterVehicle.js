"use client";

import React, { useState } from "react";
import styled from "styled-components";
import VehicleDropdown from "../vcomp/VehicleSelect";
import GeneralButton from "../vcomp/GeneralButton";

const Container = styled.div`
  width: 930px;
  height: 750px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 10px solid #ffc629;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000000;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 65px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  gap: 80px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.input`
  width: 280px;
  height: 50px;
  padding: 12px;
  font-size: 18px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  color: #000000;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
  color: #000000;
`;

const RegisterButton = styled(GeneralButton)`
  width: 320px;
  margin-top: 60px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const RegisterVehicle = () => {
  const [carID, setCarID] = useState("");
  const [trim, setTrim] = useState("");
  const [plateEnd, setPlateEnd] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState({ value: "", error: "" });
  const [imageFile, setImageFile] = useState(null); // Added state for image file

  const handleSelect = (selectedVehicle) => {
    if (!selectedVehicle || typeof selectedVehicle.carID !== "number") {
      alert(" Please select a valid vehicle!");
      return;
    }
    setCarID(selectedVehicle.carID);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]); //  Store image file
  };

  const handleMileageChange = (e) => {
    const value = e.target.value;
    const isValidMileage = /^\d*$/.test(value);
    setMileage({ value, error: isValidMileage ? "" : "Mileage must be a number" });
  };

  const handleSubmit = async () => {
    if (!carID || isNaN(carID)) {
      alert(" Please select a valid vehicle!");
      return;
    }
    if (mileage.error || !mileage.value.trim()) {
      alert(" Please enter a valid mileage (numbers only).");
      return;
    }
    if (!imageFile) {
      alert(" Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("carID", carID);
    formData.append("trim", trim.trim());
    formData.append("plateEnd", plateEnd.trim());
    formData.append("color", color.trim());
    formData.append("mileage", mileage.value.trim());
    formData.append("image", imageFile); // ✅ Attach image file

    try {
      const response = await fetch("http://localhost:8004/api/register-vehicle-with-image/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(" Vehicle registered successfully with image!");
        setCarID("");
        setTrim("");
        setPlateEnd("");
        setColor("");
        setMileage({ value: "", error: "" });
        setImageFile(null);
      } else {
        alert(` Failed to register vehicle: ${data.detail}`);
      }
    } catch (error) {
      alert("An error occurred while registering the vehicle.");
    }
  };

  return (
    <Container>
      <Header>REGISTER VEHICLE</Header>

      <FormContainer>
        <Column>
          <Label>Vehicle</Label>
          <ButtonContainer>
            <VehicleDropdown onSelect={handleSelect} />
          </ButtonContainer>

          <Label>Trim Color</Label>
          <InputField placeholder="Black" value={trim} onChange={(e) => setTrim(e.target.value)} />

          <Label>Plate No. Ending Digit</Label>
          <InputField placeholder="888" value={plateEnd} onChange={(e) => setPlateEnd(e.target.value)} />
        </Column>

        <Column>
          <Label>Color</Label>
          <InputField placeholder="Blue" value={color} onChange={(e) => setColor(e.target.value)} />

          <Label>Mileage (Km)</Label>
          <InputField placeholder="12345" value={mileage.value} onChange={handleMileageChange} />
          {mileage.error && <ErrorMessage>{mileage.error}</ErrorMessage>}

          <Label>Upload Image</Label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <RegisterButton onClick={handleSubmit}>REGISTER VEHICLE</RegisterButton>
        </Column>
      </FormContainer>
    </Container>
  );
};

export default RegisterVehicle;
