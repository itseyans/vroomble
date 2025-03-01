import React, { useState } from "react";
import styled from "styled-components";
import Button from "./SignButton.js";

const LForm = styled.div`
  padding: 20px;
  margin: 20px;
  background: #ddd;
  border: 5px solid #ffc629;
  border-radius: 10px;
  width: 350px;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const LInput = styled.input`
  color: black;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #ffc629;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
  }
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  color: black;
  font-weight: bold;
`;

const ErrorM = styled.p`
  color: red;
  margin-top: 5px;
  font-size: 14px;
`;

function LoginForm({ label, placeholder, required, errorMessage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);

    if (required && event.target.value.trim() === "") {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(required && username.trim() === ""){
        setUsernameError(true);
        return;
    }
    // Handle form submission logic here (e.g., send data to server)
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <LForm onSubmit={handleSubmit}>
    <Title>LOGIN</Title>
      <Label htmlFor="Username">Username</Label>
      <LInput
        type="text"
        id="Username"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        required={required}
        aria-invalid={usernameError}
      />
      {usernameError && <ErrorM>{errorMessage || "This field is required"}</ErrorM>}
      <Label htmlFor="Password">Password</Label>
      <LInput
        type="password"
        id="Password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <center>
      <Button type="submit">Login</Button>
      </center>
    </LForm>
  );
}

export default LoginForm;