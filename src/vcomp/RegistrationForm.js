import React, { useState } from "react";
import styled from "styled-components";
import Button from "/public/Button.js"; // Ensure this is the correct path

const FormContainer = styled.div`
  width: 660px;
  height: 740px;
  background: #ddd;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const SubmitButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background-color: black;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
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

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact Number is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

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
      <Title>REGISTER</Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>First Name</Label>
          <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Last Name</Label>
          <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Contact Number</Label>
          <Input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          {errors.contactNumber && <ErrorText>{errors.contactNumber}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Email Address</Label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Confirm Password</Label>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
        </InputGroup>

        <SubmitButton type="submit">SIGN UP</SubmitButton>
      </form>
    </FormContainer>
  );
}

export default RegistrationForm;
