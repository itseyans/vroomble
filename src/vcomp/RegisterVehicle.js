import React, { useState } from "react";
import styled from "styled-components";
import VehicleDropdown from "../vcomp/VehicleSelect"; // Assuming VehicleSelect is the filename
import GeneralButton from "../vcomp/GeneralButton";
import ImageUploadModal from "../vcomp/ImageUploadModal";

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
  margin-top: -10px; /* Adjust as needed to position error message */
  margin-bottom: 10px;
`;

const RegisterVehicle = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState();
  const [carID, setCarID] = useState(""); // Corrected state variable name
  const [trim, setTrim] = useState("");
  const [plateEnd, setPlateEnd] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState({ value: "", error: "" });

const handleSelect = (selectedVehicle) => { // Expecting the entire vehicle object now
   console.log("📡 Received CarID from Dropdown:", selectedVehicle); // Log the entire object
   console.log("🚗 Type of Received Vehicle:", typeof selectedVehicle); // Log the type of received data

   if (!selectedVehicle || typeof selectedVehicle.carID !== 'number') {
     console.error("❌ Invalid CarID:", selectedVehicle);
     alert("❌ Please select a valid vehicle!");
     return;
   }

   setCarID(selectedVehicle.carID);
   console.log("✅ CarID set:", selectedVehicle.carID, "State carID:", carID);
   console.log("🚗 Type of State carID:", typeof carID); // Log the type of state carID
 };

  const handleUploadButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleImagesUpload = (images) => {
    setUploadedImages(images);
    setShowModal(false);
  };

  const handleMileageChange = (e) => {
    const value = e.target.value;
    const isValidMileage = /^\d*$/.test(value); // Regex to allow only digits

    if (isValidMileage) {
      setMileage({ value: value, error: "" }); // Valid input, clear error
    } else {
      setMileage({ value: value, error: "Mileage must be a number" }); // Invalid input, set error message
    }
  };

  const handleSubmit = async () => {
    console.log("📡 Submitting Vehicle Registration...");
    console.log("Current carID before submit:", carID, typeof carID); // ⭐️ Log carID and its type before submit
    console.log("handleSubmit - trim value:", trim); // ADD THIS LINE - DEBUGGING

    if (!carID || isNaN(carID)) {
      console.error("❌ Invalid CarID in handleSubmit:", carID);
      alert("❌ Please select a valid vehicle!");
      return;
    }

    if (mileage.error || !mileage.value.trim()) { // Check for mileage error or empty value
      alert("❌ Please enter a valid mileage (numbers only).");
      return; // Prevent form submission
    }

    const formData = {
      carID: parseInt(carID), // Keep parseInt to ensure integer for API
      trim: trim.trim(), // Line 141 - Potential Error
      plateEnd: plateEnd.trim(),
      color: color.trim(),
      mileage: mileage.value.trim(),
    };

    console.log("📡 Sending Data to API:", formData);

    try {
      const response = await fetch("http://localhost:8004/api/register-vehicle/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Vehicle registered successfully!");
        setCarID(""); // Reset carID after successful registration
        setTrim("");
        setPlateEnd("");
        setColor("");
        setMileage({ value: "", error: "" }); // Reset mileage state after successful registration
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to register vehicle: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("An error occurred while registering the vehicle.");
    }
  };

  return (
    <Container>
      <Header>🚗 REGISTER VEHICLE</Header>

      <FormContainer>
        <Column>
          <Label>Vehicle</Label>
          <ButtonContainer>
            <VehicleDropdown onSelect={handleSelect} /> {/* Pass handleSelect to onSelect */}
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
          <InputField placeholder="12345" value={mileage.value} onChange={handleMileageChange} error={mileage.error} />
          {mileage.error && <ErrorMessage>{mileage.error}</ErrorMessage>}
          <ButtonContainer style={{ marginTop: "50px" }}>
            <GeneralButton onClick={handleUploadButtonClick}>+ Upload Images</GeneralButton>
          </ButtonContainer>
          {showModal && (
            <ImageUploadModal onClose={handleModalClose} onUpload={handleImagesUpload} />
          )}

          <RegisterButton onClick={handleSubmit}>REGISTER VEHICLE</RegisterButton>
        </Column>
      </FormContainer>
    </Container>
  );
};

export default RegisterVehicle;