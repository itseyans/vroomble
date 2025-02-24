import React, { useState } from "react";
import styled from "styled-components";
import Button from "/public/Button.js";

const LForm = styled.div`
  padding: 20px;
  margin: 20px;
  border: 5px solid #ffc629;
  border-radius: 10px;
  width: 350px;
  height: 400px;
`;

const LInput = styled.input`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 300px; /* Adjust as needed */
  box-sizing: border-box;

  &:focus {
    // Style on focus
    border-color: #ffc629; // Example: Blue border
    outline: none; // Remove default outline
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2); // Optional: Subtle shadow
  }
`;

const Label = styled.label`
  position: relative;
  left: -110px;
  font-weight: bold;
`;

const ErrorM = styled.p`
  color: red;
  margin-top: 5px;
  font-size: 14px;
`;

function LoginForm({ label, placeholder, required, errorMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleChange = (event) => {
    setInputValue(event.target.value);

    // Basic validation (example: required field)
    if (required && event.target.value.trim() === "") {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  return (
    <LForm>
      <Label htmlFor="myInput">Username</Label>
      <LInput
        type="text"
        id="Username"
        placeholder="Username"
        onChange={handleChange}
        required={required} // Pass the required prop to the input
        aria-invalid={hasError} // For accessibility
      />
      <LInput type="password" id="Password" placeholder="Password" />
      {hasError && (
        <ErrorMessage>{errorMessage || "This field is required"}</ErrorMessage>
      )}{" "}
      {/* Display error message */}
      <Button type="submit">Login</Button>
    </LForm>
  );
}

export default LoginForm;
