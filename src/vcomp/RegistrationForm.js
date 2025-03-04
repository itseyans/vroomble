import React, { useState } from "react";
import styled from "styled-components";
import Button from "./SignButton.js";

const FormContainer = styled.div`
  width: 660px;
  height: auto;
  background: #ddd;
  border-radius: 20px;
  border: 5px solid #ffc629;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
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
  color: black;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 30px;
  margin-bottom: 5px;
`;

const LInput = styled.input`
  color: black;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  width: 300px; 
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

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Registration Successful!");
      console.log("User Data:", formData);
    }
  };

  return (
    <FormContainer>
      <Title style={{ fontFamily: "Segoe UI Variable, sans-serif" }}>
        REGISTER
      </Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <StyledLabel>First Name</StyledLabel>
          <LInput
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Last Name</StyledLabel>
          <LInput
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Contact Number</StyledLabel>
          <LInput
            type="number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && (
            <ErrorText>{errors.contactNumber}</ErrorText>
          )}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Email Address</StyledLabel>
          <LInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Password</StyledLabel>
          <LInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel>Confirm Password</StyledLabel>
          <LInput
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <ErrorText>{errors.confirmPassword}</ErrorText>
          )}
        </InputGroup>

        <Button type="submit">SIGN UP</Button>
      </form>
    </FormContainer>
  );
}

export default RegistrationForm;
