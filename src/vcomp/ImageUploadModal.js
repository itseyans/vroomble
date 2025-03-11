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
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  text-align: center;
  color: #000000;
`;

const Input = styled.input`
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 16px;
  background-color: #ffc629;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #e6b800;
  }
`;

const ImageUploadModal = ({ onClose, onUpload, usersRV_ID }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    setSelectedImages([...event.target.files]);
  };

  const handleUpload = async () => {
    if (!usersRV_ID) {
      alert("❌ Vehicle ID is missing. Register a vehicle first.");
      return;
    }

    if (selectedImages.length === 0) {
      alert("❌ Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("usersRV_ID", usersRV_ID);
    formData.append("file", selectedImages[0]); // Uploading only the first image

    try {
      const response = await fetch("http://localhost:8004/api/upload-vehicle-image/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Image uploaded successfully!");
        console.log("📂 Image stored at:", data.file_path);
        onUpload(data.file_path); // Pass uploaded file path back to parent
      } else {
        alert(`❌ Failed to upload image: ${data.detail}`);
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);
      alert("An error occurred while uploading the image.");
    }

    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Upload Vehicle Images</h2>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        <Button onClick={handleUpload}>Upload</Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageUploadModal;
