"use client";

import React, { useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: #ffc629;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1em;
  border-radius: 5px;
  transition: background 0.3s;
  font-weight: bold;
  color: black;

  &:hover {
    background-color: #e6b800;
  }
`;

const InputContainer = styled.div`
  margin-top: 10px;
  text-align: center;
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

const AddImage = ({ usersRV_ID }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 3) {
      alert("❌ You can only upload up to 3 images.");
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
  };

const handleUpload = async () => {
    if (!usersRV_ID) {
      alert("❌ Please select a vehicle first.");
      return;
    }

    if (selectedImages.length === 0) {
      alert("❌ Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("UserRV_ID", usersRV_ID); // ✅ Include correct Registered Vehicle ID

    selectedImages.forEach((image) => {
      formData.append("images", image, `${usersRV_ID}_${image.name}`); // ✅ Correct: UserRV_ID + original filename
    });

    try {
      const response = await fetch("http://localhost:8004/api/upload-vehicle-images/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Images uploaded successfully!");
        console.log("📂 Images stored at:", data.file_paths);
        setSelectedImages([]);
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
    <>
      <Button>
        <label htmlFor="file-upload">Add Image</label>
      </Button>

      <InputContainer>
        <FileInput id="file-upload" type="file" accept="image/*" multiple onChange={handleImageChange} />
      </InputContainer>

      <PreviewContainer>
        {selectedImages.length > 0 ? (
          selectedImages.map((image, index) => (
            <PreviewImage key={index} src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
          ))
        ) : (
          <p style={{ color: "gray" }}>No images selected</p>
        )}
      </PreviewContainer>

      <ButtonContainer>
        <Button onClick={handleUpload}>Upload</Button>
      </ButtonContainer>
    </>
  );
};

export default AddImage;
