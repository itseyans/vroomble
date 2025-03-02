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

  const SearchInput = styled.input` // 
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

  const [dropdowns, setDropdowns] = useState({
    body_type: false,
    transmission: false,
    drivetrain: false,
    fuel_type: false,
    year: false,
  });


useEffect(() => {
  fetch("http://localhost:8000/dropdown_options/", {
    method: "GET", // Ensure it's GET
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setBodyTypes(data.body_types || []);
      setTransmissions(data.transmissions || []);
      setDrivetrains(data.drivetrains || []);
      setFuelTypes(data.fuel_types || []);
    })
    .catch((error) => console.error("Error fetching dropdown options:", error));
}, []);

const [bodyTypes, setBodyTypes] = useState([]); // Keep only one declaration
const [transmissions, setTransmissions] = useState([]);
const [drivetrains, setDrivetrains] = useState([]);
const [fuelTypes, setFuelTypes] = useState([]);


  const years = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse();


  const [bodyTypeSearchTerm, setBodyTypeSearchTerm] = useState(""); // Define it

  const dropdownRef = useRef(null);

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

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Raw Form Data:", formData); // Logs the state object

  const formattedData = {
    ...formData,
    year: Number(formData.year),  // Convert year to a number
    retail_srp: Number(formData.retail_srp),  // Convert retail_srp to a number
  };

  console.log("Formatted Data being sent:", JSON.stringify(formattedData, null, 2)); 

  try {
    const response = await fetch("http://localhost:8000/cars/form/", { // <-- IMPORTANT: Keep pointing to /submit_form/
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
   }

    const data = await response.json();
    console.log("Server Response:", data);
    alert(data.message);

    // Clear form after successful submission
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
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
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
            <DropdownButton type="button" onClick={() => toggleDropdown("body_type")}>
                {formData.body_type || "Select Body Type"}
              </DropdownButton>
              {dropdowns.body_type && (
                <DropdownList>
                  <SearchInput
  type="text"
  placeholder="Search body types..."
  value={bodyTypeSearchTerm}
  onChange={(e) => setBodyTypeSearchTerm(e.target.value)}
  onMouseDown={(e) => e.stopPropagation()} // Prevent dropdown from closing
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
            <DropdownButton type="button" onClick={() => toggleDropdown("transmission")}>
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
            <DropdownButton type="button" onClick={() => toggleDropdown("drivetrain")}>
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
            <DropdownButton type="button" onClick={() => toggleDropdown("fuel_type")}>
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
            <DropdownButton type="button" onClick={() => toggleDropdown("year")}>
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