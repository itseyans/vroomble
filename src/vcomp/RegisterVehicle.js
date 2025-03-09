import React, { useState } from "react";
import styled from "styled-components";
import VehicleDropdown from "../vcomp/VehicleSelect";
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

const RegisterVehicle = () => {
    const [showModal, setShowModal] = useState(false);
    const [uploadedImages, setUploadedImages] = useState();
    const [carID, setCarID] = useState("");
    const [trim, setTrim] = useState("");
    const [plateEnd, setPlateEnd] = useState("");
    const [color, setColor] = useState("");
    const [mileage, setMileage] = useState("");

    const handleSelect = (selectedId) => {
        console.log("📡 Received CarID from Dropdown:", selectedId, typeof selectedId);
        if (!selectedId || isNaN(selectedId)) {
            console.error("❌ Invalid CarID:", selectedId, typeof selectedId);
            alert("❌ Please select a valid vehicle!");
            return;
        }
        setCarID(selectedId);
        console.log("✅ carID set:", selectedId, "State carID:", carID); // Corrected log to lowercase 'carID'
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

    const handleSubmit = async () => {
        console.log("📡 Submitting Vehicle Registration...");
        console.log("Current carID before submit:", carID, typeof carID);

        if (!carID || isNaN(carID)) {
            console.error("❌ Invalid carID in handleSubmit:", carID); // Corrected log to lowercase 'carID'
            alert("❌ Please select a valid vehicle!");
            return;
        }

        const formData = {
            carID: parseInt(carID), 
            trim: trim.trim(),
            plateEnd: plateEnd.trim(),
            color: color.trim(),
            mileage: mileage.trim(),
        };

        console.log("📡 Sending Data to API:", formData); // This log should now show 'carID'

        try {
            const response = await fetch("http://localhost:8004/api/register-vehicle/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("✅ Vehicle registered successfully!");
                setCarID("");
                setTrim("");
                setPlateEnd("");
                setColor("");
                setMileage("");
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
                        <VehicleDropdown onSelect={handleSelect} />
                    </ButtonContainer>

                    <Label>Trim Color</Label>
                    <InputField placeholder="Black" value={trim} onChange={(e) => setTrim(e.target.value)} />

                    <Label>Plate End (3)</Label>
                    <InputField placeholder="888" value={plateEnd} onChange={(e) => setPlateEnd(e.target.value)} />
                </Column>

                <Column>
                    <Label>Color</Label>
                    <InputField placeholder="Blue" value={color} onChange={(e) => setColor(e.target.value)} />

                    <Label>Mileage</Label>
                    <InputField placeholder="12345 KM" value={mileage} onChange={(e) => setMileage(e.target.value)} />

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