import React, { useState } from "react";
import styled from "styled-components";
import VehicleDropdown from "../vcomp/VehicleSelect"; // Vehicle selection dropdown
import GeneralButton from "../vcomp/GeneralButton"; // Buttons for Upload & Register
import ImageUploadModal from "../vcomp/ImageUploadModal";


const Container = styled.div`
  width: 930px;
  height: 750px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center everything horizontally */
  justify-content: center; /* Center everything vertically */
  border: 10px solid #ffc629; /* 2px Yellow Stroke */
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
  gap: 65px; /* Adjusted spacing for perfect alignment */
  align-items: center;
  justify-content: center; /* Center the buttons */
  width: 100%;
  margin-bottom: 20px; /* More spacing below buttons */
`;

const FormContainer = styled.div`
  display: flex;
  gap: 80px;
  justify-content: center; /* Center the form content */
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
`;

const TextArea = styled.textarea`
  width: 320px;
  height: 173px;
  padding: 22px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
  color: #000000;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const RegisterButton = styled(GeneralButton)`
  width: 320px;
  margin-top: 60px; /* Ensure proper spacing from text area */
`;


const RegisterVehicle = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUploadButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleImagesUpload = (images) => {
    setUploadedImages(images); // Update uploadedImages with the array of images
    setShowModal(false);
  };

  return (
    <Container>
      <Header>🚗 REGISTER VEHICLE</Header>

      {/* Form Fields */}
      <FormContainer>
        {/* Left Column */}
        <Column>
          <Label>Vehicle</Label>
          <ButtonContainer>
            <VehicleDropdown />
          </ButtonContainer>

          <Label>Trim</Label>
          <InputField placeholder="Sports, XE, etc."></InputField>

          <Label>Plate End (3)</Label>
          <InputField placeholder="888" />
        </Column>

        {/* Right Column */}
        <Column>
          <Label>Color</Label>
          <InputField placeholder="Blue" />

          <Label>Mileage</Label>
          <InputField placeholder="12345 KM" />

          <ButtonContainer style={{marginTop:'50px'}}>
            <GeneralButton onClick={handleUploadButtonClick}>
              + Upload Images
            </GeneralButton>
          </ButtonContainer>
          {showModal && (
            <ImageUploadModal
              onClose={handleModalClose}
              onUpload={handleImagesUpload}
            />
          )}

          <RegisterButton>REGISTER VEHICLE</RegisterButton>
        </Column>
      </FormContainer>
    </Container>
  );
};

export default RegisterVehicle;
