"use client";

import React, { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 450px;
  max-width: 90%;
  text-align: center;
  color: black;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
  font-weight: bold;
  color: black;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 10px 15px;
  background-color: #ffc629;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: black;
  border: none;
  &:hover {
    background-color: #e6b800;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ccc;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: ${({ $danger }) => ($danger ? "#ff4d4d" : "#ffc629")};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: black;
  width: 45%;

  &:hover {
    background-color: ${({ $danger }) => ($danger ? "#cc0000" : "#e6b800")};
  }
`;

const ImageUploadModal = ({ onClose, onUpload, usersRV_ID }) => {
  const [selectedImages, setSelectedImages] = useState([]);

const handleImageChange = (event) => {
  const files = Array.from(event.target.files); // Convert FileList to Array
  if (files.length > 3) {
    alert("❌ You can only upload up to 3 images.");
    return;
  }

  // ✅ Ensure images are stored as `File` objects
  const validImages = files.filter(file => file instanceof File);
  if (validImages.length !== files.length) {
    alert("❌ Some files are not valid images.");
    return;
  }

  setSelectedImages(validImages); // ✅ Store `File` objects in state
};


const handleUpload = async () => {
  console.log("✅ Received Vehicle ID in Modal:", usersRV_ID);

  if (!usersRV_ID) {
    alert("❌ Vehicle ID is missing. Register a vehicle first.");
    return;
  }

  if (selectedImages.length === 0) {
    alert("❌ Please select at least one image.");
    return;
  }

  const formData = new FormData();
  formData.append("UserRV_ID", usersRV_ID);

  selectedImages.forEach((image) => {
    formData.append("images", image);  // ✅ Append only images
  });

  try {
    const response = await fetch("http://localhost:8005/api/upload-vehicle-images/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Images uploaded successfully!");
      console.log("📂 Images stored at:", data.file_paths);
      onUpload(data.file_paths);
      onClose();
    } else {
      console.error("❌ Upload failed:", data);
      alert(`❌ Failed to upload images: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("❌ Image Upload Error:", error);
    alert("An error occurred while uploading the images.");
  }
};




  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Upload Images</Title>

        <InputContainer>
          <FileInput id="file-upload" type="file" accept="image/*" multiple onChange={handleImageChange} />
          <UploadLabel htmlFor="file-upload">Choose Files</UploadLabel>
        </InputContainer>

        {/* ✅ Image Preview Section */}
        <PreviewContainer>
          {selectedImages.length > 0 ? (
            selectedImages.map((image, index) => (
              <PreviewImage key={index} src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
            ))
          ) : (
            <p style={{ color: "gray" }}>No images selected</p>
          )}
        </PreviewContainer>

        {/* ✅ Buttons */}
        <ButtonContainer>
        <Button type="button" onClick={handleUpload}>Upload</Button>

        <Button $danger onClick={onClose}>Cancel</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageUploadModal;
