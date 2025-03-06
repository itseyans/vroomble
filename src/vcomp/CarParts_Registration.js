import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 450px;
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
  color: #333; /* Darker text color */
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
  color: #333; /* Darker text color */
  font-size: 18px; /* Increased font size */
`;

const LInput = styled.input`
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 18px; /* Increased font size */
  width: 300px; /* Fixed width */
  box-sizing: border-box;
  font-family: sans-serif; /* Example font family */
  color: #333;

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

const Button = styled.button`
  background-color: #ffc629; /* Gold background color */
  color: black;
  padding: 12px 24px; /* Increased padding */
  border: none;
  border-radius: 12px; /* Larger border radius */
  cursor: pointer;
  font-size: 18px; /* Increased font size */
  transition: background-color 0.3s ease; /* Add hover effect */
  font-weight: bold; // Make the button label bold

  &:hover {
    background-color: #e6b800; /* Slightly darker gold on hover */
  }
`;

const StyledSelect = styled.select`
  width: 300px;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 18px;
  font-family: sans-serif;
  color: #333;
`;

const categories = [
  "Offroad", "Street", "Maintenance", "Sports", "Wheels", "Exterior", "Interior", "Tires"
]; 

function CarPartRegistrationForm() {
  const [formData, setFormData] = useState({
    make: "",
    part_name: "",
    model_number: "",
    category: "",
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
    if (!formData.part_origSRP.trim())
      newErrors.part_origSRP = "Original SRP is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
                              e.preventDefault();
                              if (validateForm()) {
                                  try {
                                      const response = await fetch("http://127.0.0.1:8000/car_parts/", { // Corrected endpoint
                                          method: "POST",
                                          headers: {
                                              "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify(formData),
                                      });
                          
                                      if (response.ok) {
                                          // Request was successful
                                          console.log("Car part registered successfully!");
                                          // Optionally, you can reset the form or update the UI here
                                      } else {
                                          // Request failed
                                          console.error("Failed to register car part");
                                          // Handle the error, e.g., display an error message to the user
                                      }
                                  } catch (error) {
                                      console.error("Error:", error);
                                      // Handle network or other errors
                                  }
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
          <StyledSelect
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </StyledSelect>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
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

export default CarPartRegistrationForm;