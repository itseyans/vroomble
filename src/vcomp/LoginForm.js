"use client"; // Add this for client components in Next.js
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router
import styled from "styled-components";

const LForm = styled.form`
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
    margin-right: 300px;
    color: black;
    font-weight: bold;
`;

const ErrorM = styled.p`
    color: red;
    margin-top: 5px;
    font-size: 14px;
`;

function LoginForm({ required, errorMessage }) {
    const router = useRouter(); // Use Next.js router
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError(required && event.target.value.trim() === "");
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(required && event.target.value.trim() === "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit called!");

        if (required && email.trim() === "") {
            setEmailError(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (response.ok) {
                console.log(" Login successful!");
                router.push("/homepage"); // Redirect using Next.js router
            } else {
                const errorData = await response.json();
                setLoginError(errorData.detail || "Login failed");
            }
        } catch (error) {
            console.error(" Login error:", error);
            setLoginError("An unexpected error occurred.");
        }
    };

    return (
        <LForm onSubmit={handleSubmit}>
            <Title>LOGIN</Title>
            <Label htmlFor="email">Email</Label>
            <LInput
                type="text"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required={required}
                aria-invalid={emailError}
            />
            {emailError && <ErrorM>{errorMessage || "This field is required"}</ErrorM>}

            <Label htmlFor="password">Password</Label>
            <LInput
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required={required}
                aria-invalid={passwordError}
            />
            {passwordError && <ErrorM>{errorMessage || "This field is required"}</ErrorM>}

            {loginError && <ErrorM>{loginError}</ErrorM>}

            <center>
                <button
                    type="submit"
                    style={{
                        fontSize: "20px",
                        color: "#131415",
                        width: "155px",
                        height: "35px",
                        border: "2px solid #131415",
                        borderRadius: "20px",
                        transition: "background-color 0.3s",
                        backgroundColor: "white",
                        cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#FFC629")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
                >
                    Login
                </button>
            </center>
        </LForm>
    );
}

export default LoginForm;
