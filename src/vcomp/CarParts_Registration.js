import React, { useState } from "react";
import styled from "styled-components";
import Button from "./SignButton.js"; // Ensure this is the correct path

const FormContainer = styled.div`
  width: 700px;
  height: auto;
  background: #ddd;
  border-radius: 20px;
  border: 5px solid #ffc629;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  align-self: flex-start;
  margin-left: 30px;
  margin-bottom: 5px;
`;

const LInput = styled.input`
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  width: 300px; /* Fixed width */
  box-sizing: border-box;

  &:focus {
    border-color: #ffc629;
    outline: none;
    box-shadow: 0 0 5px rgba(255, 198, 41, 0.5);
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

function CarPartRegistrationForm() {
  // Changed function name
  const [formData, setFormData] = useState({
    make: "",
    part_name: "",
    model_number: "",
    category: "",
    year: "",
    part_origSRP: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.make.trim()) newErrors.make = "Make is required";
    if (!formData.part_name.trim())
      newErrors.part_name = "Part Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.part_origSRP.trim())
      newErrors.part_origSRP = "Original SRP is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Car Part Registration Successful!");
      console.log("Car Part Data:", formData);
    }
  };

  return (
    <FormContainer>
      <Title style={{ fontFamily: "Segoe UI Variable, sans-serif" }}>
        CAR PART REGISTRATION
      </Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <StyledLabel>Make</StyledLabel>
          <LInput
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
          />
          {errors.make && <ErrorText>{errors.make}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Part Name</StyledLabel>
          <LInput
            type="text"
            name="part_name"
            value={formData.part_name}
            onChange={handleChange}
          />
          {errors.part_name && <ErrorText>{errors.part_name}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Model Number (Optional)</StyledLabel>
          <LInput
            type="text"
            name="model_number"
            value={formData.model_number}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <StyledLabel>Category</StyledLabel>
          <LInput
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Year</StyledLabel>
          <LInput
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
          {errors.year && <ErrorText>{errors.year}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Original SRP</StyledLabel>
          <LInput
            type="number"
            name="part_origSRP"
            value={formData.part_origSRP}
            onChange={handleChange}
          />
          {errors.part_origSRP && <ErrorText>{errors.part_origSRP}</ErrorText>}
        </InputGroup>

        <Button type="submit">REGISTER PART</Button>
      </form>
    </FormContainer>
  );
}