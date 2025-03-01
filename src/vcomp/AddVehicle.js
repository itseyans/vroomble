import React, { useState, useEffect, useRef } from "react";
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

const DropdownContainer = styled.div`
  position: relative;
  width: 280px;
`;

const DropdownButton = styled.button`
  width: 230px;
  height: 50px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  background: white;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
  padding: 0;
  z-index: 10;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.li`
  padding: 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  max-width: 100%;
  overflow-x: hidden;

  &:hover {
    background: #ffc629;
  }
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

  const [dropdowns, setDropdowns] = useState({
    body_type: false,
    transmission: false,
    drivetrain: false,
    fuel_type: false,
    year: false,
  });

  const [bodyTypes, setBodyTypes] = useState();
  const [bodyTypeSearchTerm, setBodyTypeSearchTerm] = useState("");
  const [transmissions, setTransmissions] = useState(["Automatic", "Manual"]);
  const [drivetrains, setDrivetrains] = useState(["FWD", "RWD", "AWD", "4WD"]);
  const [fuelTypes, setFuelTypes] = useState(["Gasoline", "Diesel", "Electric", "Hybrid"]);
  const years = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse();

  const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  border-radius: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-bottom: 2px solid #ffc629;
  }
`;

  const dropdownRef = useRef(null);

  useEffect(() => {
                              fetch("http://127.0.0.1:8000/dropdown_options/", {
                                  method: "POST",
                                  headers: {
                                      "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify({ name: "Test", value: 123 })
                              })
                              .then(response => {
                                  console.log("Response Status:", response.status);  // Logs status (e.g., 200, 404, 500)
                                  return response.text();  // Read raw response (even if it's HTML)
                              })
                              .then(data => {
                                  console.log("Raw Response Body:", data);  // Logs the actual response content
                                  try {
                                      const jsonData = JSON.parse(data);  // Try parsing JSON (if valid)
                                      console.log("Parsed JSON:", jsonData);
                                  } catch (error) {
                                      console.error("Error parsing JSON:", error);
                                  }
                              })
                              .catch(error => console.error("Fetch Error:", error));
                          
                          }, []); // <-- Empty dependency array to run only once on mount





  const filteredBodyTypes = bodyTypes?.filter((type) =>
    type.toLowerCase().includes(bodyTypeSearchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setDropdowns({ ...dropdowns, [name]: false });
  };

  const toggleDropdown = (name) => {
    setDropdowns({ ...dropdowns, [name]: !dropdowns[name] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    fetch('/cars/form/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        alert(data.message);
        // Clear the form after successful submission
        setFormData({
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
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <Container>
      <Header>Add Vehicle</Header>
      <form onSubmit={handleSubmit}>
        <InputsRow>
          <Column>
            <Label>Make</Label>
            <InputField
              type="text"
              name="make"
              placeholder="e.g., Toyota"
              value={formData.make}
              onChange={handleChange}
            />
          </Column>
          <Column>
            <Label>Model</Label>
            <InputField
              type="text"
              name="model"
              placeholder="e.g., Fortuner"
              value={formData.model}
              onChange={handleChange}
            />
          </Column>
          <Column>
            <Label>Body Type</Label>
            <DropdownContainer ref={dropdownRef}>
              <DropdownButton onClick={() => toggleDropdown("body_type")}>
                {formData.body_type || "Select Body Type"}
              </DropdownButton>
              {dropdowns.body_type && (
                <DropdownList>
                  <SearchInput
                    type="text"
                    placeholder="Search body types..."
                    value={bodyTypeSearchTerm}
                    onChange={(e) => setBodyTypeSearchTerm(e.target.value)}
                  />
                  {bodyTypes.length > 0 ? ( // Conditionally render the list
                    filteredBodyTypes.map((type) => (
                      <DropdownItem
                        key={type}
                        onClick={() => handleDropdownChange("body_type", type)}
                      >
                        {type}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem disabled>Loading body types...</DropdownItem>
                  )}
                </DropdownList>
              )}
            </DropdownContainer>
          </Column>
        </InputsRow>
        <InputsRow>
          <Column>
            <Label>Variant</Label>
            <InputField
              type="text"
              name="variant"
              placeholder="e.g., G, XLT, SPORT"
              value={formData.variant}
              onChange={handleChange}
            />
          </Column>
          <Column>
            <Label>Transmission</Label>
            <DropdownContainer>
              <DropdownButton onClick={() => toggleDropdown("transmission")}>
                {formData.transmission || "Select Transmission"}
              </DropdownButton>
              {dropdowns.transmission && (
                <DropdownList>
                  {transmissions.map((type) => (
                    <DropdownItem
                      key={type}
                      onClick={() => handleDropdownChange("transmission", type)}
                    >
                      {type}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
          </Column>
          <Column>
            <Label>Drivetrain</Label>
            <DropdownContainer>
              <DropdownButton onClick={() => toggleDropdown("drivetrain")}>
                {formData.drivetrain || "Select Drivetrain"}
              </DropdownButton>
              {dropdowns.drivetrain && (
                <DropdownList>
                  {drivetrains.map((type) => (
                    <DropdownItem
                      key={type}
                      onClick={() => handleDropdownChange("drivetrain", type)}
                    >
                      {type}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
          </Column>
        </InputsRow>
        <InputsRow>
          <Column>
            <Label>Fuel Type</Label>
            <DropdownContainer>
              <DropdownButton onClick={() => toggleDropdown("fuel_type")}>
                {formData.fuel_type || "Select Fuel Type"}
              </DropdownButton>
              {dropdowns.fuel_type && (
                <DropdownList>
                  {fuelTypes.map((type) => (
                    <DropdownItem
                      key={type}
                      onClick={() => handleDropdownChange("fuel_type", type)}
                    >
                      {type}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
          </Column>
          <Column>
            <Label>Year</Label>
            <DropdownContainer>
              <DropdownButton onClick={() => toggleDropdown("year")}>
                {formData.year || "Select Year"}
              </DropdownButton>
              {dropdowns.year && (
                <DropdownList>
                  {years.map((year) => (
                    <DropdownItem
                      key={year}
                      onClick={() => handleDropdownChange("year", year.toString())}
                    >
                      {year}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
          </Column>
          <Column>
            <Label>Retail SRP</Label>
            <InputField
              type="text"
              name="retail_srp"
              placeholder="e.g., 1300000"
              value={formData.retail_srp}
              onChange={handleChange}
            />
          </Column>
        </InputsRow>
        <ButtonContainer>
          <GeneralButton type="submit">Add Vehicle</GeneralButton>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default AddVehicle;