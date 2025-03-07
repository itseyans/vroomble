// ImageUploadModal.js
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
`;

const Input = styled.input`
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin: 5px;
`;

const ImageUploadModal = ({ onClose, onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    setSelectedImages([...event.target.files]);
  };

  const handleUpload = () => {
    onUpload(selectedImages);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Upload Images</h2>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button onClick={handleUpload}>Upload</Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageUploadModal;