import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SelectBrand from "./SelectBrand";
import SelectFuel from "./SelectFuel";
import Driveselect from "./SelectDrivetrain";
import SelectTrans from "./SelectTrans";
import SelectBody from "./SelectBody";
import GeneralButton from "./GeneralButton";
import SelectYear from "./SelectYear";

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
    transmission: "",
    drivetrain: "",
    fuel_type: "",
    year: "",
    retail_srp: "",
    variant: "",
  });
  const [message, setMessage] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState({});

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await fetch("http://localhost:8000/dropdown_options/");
        if (response.ok) {
          const data = await response.json();
          setDropdownOptions(data);
        } else {
          console.error("Failed to fetch dropdown options");
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchDropdownOptions();
  }, []); // Corrected useEffect dependency array

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // ... validation logic (same as before) ...
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clean SRP input
    const cleanSRP = parseFloat(formData.retail_srp.replace(/[^0-9.]/g, ""));

    // Validate all fields
    if (!validateForm(cleanSRP)) return;

    // Create JSON payload
    const payload = {
      ...formData,
      year: parseInt(formData.year, 10),
      retail_srp: cleanSRP,
    };

    try {
      const response = await fetch("http://localhost:8000/cars/form/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Car added successfully!");
        setFormData({
          make: "",
          model: "",
          body_type: "",
          transmission: "",
          drivetrain: "",
          fuel_type: "",
          year: "",
          retail_srp: "",
          variant: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const validateForm = (srp) => {
    // ... validation logic (same as before) ...
  };

  return (
    <Container>
      <Header>🚗 ADD VEHICLE</Header>
      <Row>
        <SelectBrand
          value={formData.make}
          onChange={handleChange}
          options={dropdownOptions.makes || []} // corrected
          name="make"
        />
        <SelectFuel
          value={formData.fuel_type}
          onChange={handleChange}
          options={dropdownOptions.fuel_types || []} // corrected
          name="fuel_type"
        />
        <Driveselect
          value={formData.drivetrain}
          onChange={handleChange}
          options={dropdownOptions.drivetrains || []} // corrected
          name="drivetrain"
        />
        <SelectTrans
          value={formData.transmission}
          onChange={handleChange}
          options={dropdownOptions.transmissions || []} // corrected
          name="transmission"
        />
      </Row>
      <Row>
        <SelectYear value={formData.year} onChange={handleChange} name="year" />
        <SelectBody
          value={formData.body_type}
          onChange={handleChange}
          options={dropdownOptions.body_types || []} // corrected
          name="body_type"
        />
      </Row>
      <InputsRow>
        <Column>
          <Label>MODEL</Label>
          <InputField
            name="model"
            placeholder="VIOS"
            value={formData.model}
            onChange={handleChange}
          />
        </Column>
        <Column>
          <Label>Retail SRP</Label>
          <InputField
            name="retail_srp"
            placeholder="PHP 1,500,000.00"
            value={formData.retail_srp}
            onChange={(e) => {
              // Allow only numbers and decimal
              const value = e.target.value.replace(/[^0-9.]/g, "");
              handleChange({
                target: {
                  name: "retail_srp",
                  value: value.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                },
              });
            }}
          />
        </Column>
        <Column>
          <Label>Variant</Label>
          <InputField
            name="variant"
            placeholder="G, E, J, etc."
            value={formData.variant}
            onChange={handleChange}
          />
        </Column>
      </InputsRow>
      <ButtonContainer>
        <GeneralButton onClick={handleSubmit}>ADD VEHICLE</GeneralButton>
      </ButtonContainer>
      {message && <div>{message}</div>}
    </Container>
  );
};

export default AddVehicle;