import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GeneralButton from "./GeneralButton";

const Container = styled.div`
  width: 950px;
  background: #d9d9d9;
  border-radius: 12px;
  padding: 30px;
  border: 4px solid #ffc629;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: black;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  color: black;

  & > * {
    margin-right: 50px;
    margin-bottom: 20px;
  }

  & > *:last-child {
    margin-right: 0;
  }
`;

const InputsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
  color: black;
  font-weight: bold;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const InputField = styled.input`
  width: 230px;
  height: 50px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background: white;
  text-align: center;
  color: black;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    body_type: "",
    variant: "",
    transmission: "",
    drivetrain: "",
    fuel_type: "",
    year: "",
    retail_srp: "",
  });
