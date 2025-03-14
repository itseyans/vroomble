import React, { useState } from "react";
import styled from "styled-components";
import GeneralButton from "@/vcomp/GeneralButton";
import ImageUploadModal from "@/vcomp/ImageUploadModal";

// ✅ Styled Components (same as before)
const FormContainer = styled.div`
  width: 400px;
  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: 2em;
  border-bottom: 2px solid #ccc;
  color: black;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  color: black;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: black;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: black;
`;

const LInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  color: black;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const DateDropdownContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DateDropdown = styled.select`
  width: 32%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UploadButton = styled(GeneralButton)`
  background-color: #f0f0e0;
  padding: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 30px;
  width: 180px;
  font-size: 14px;
  color: black;

  &:hover {
    background-color: #ffdf70;
  }
`;

const SubmitButton = styled(GeneralButton)`
  margin-top: 20px;
  width: 200px;
  font-size: 16px;
  color: black;
`;

// ✅ Helper Functions for Dates
const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 20 }, (_, i) => currentYear - i); // Last 20 years
};

const getDays = () => {
  return Array.from({ length: 31 }, (_, i) => i + 1);
};

const getMonths = () => {
  return [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
};

// ✅ Main Component
const Changes = ({ selectedVehicle }) => {
  const [changeType, setChangeType] = useState("Maintenance");
  const [details, setDetails] = useState("");
  const [cost, setCost] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Date State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ✅ Get `UserRV_ID` from the selected vehicle
  const userRV_ID = selectedVehicle?.usersRV_ID || null;

  // ✅ Image Upload Functions
  const handleUploadButtonClick = () => {
    setShowModal(!showModal);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleImagesUpload = (images) => {
    setUploadedImage(images);
    setShowModal(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedVehicle) {
    alert("❌ Error: No vehicle selected.");
    return;
  }

  console.log("UserRV_ID:", selectedVehicle.usersRV_ID);
  console.log("Change Type:", changeType);
  console.log("Details:", details);
  console.log("Cost:", cost);
  console.log("Date:", `${selectedYear}-${selectedMonth + 1}-${selectedDay}`);

  const formData = new FormData();
  formData.append("UserRV_ID", selectedVehicle.usersRV_ID);
  formData.append("ChangeType", changeType);
  formData.append("Details", details);
  formData.append("Cost", cost);
  formData.append("Date", `${selectedYear}-${selectedMonth + 1}-${selectedDay}`);

  if (uploadedImage.length > 0) {
    uploadedImage.forEach((file) => {
      formData.append("images", file);  // ✅ Append all selected images
    });
  }

  try {
    const response = await fetch("http://localhost:8005/api/add-maintenance/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Maintenance record added successfully!");
      console.log("📂 Saved images:", data.filenames);
    } else {
      alert(`❌ Failed to add maintenance record: ${data.detail}`);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("❌ Server error. Please try again later.");
  }
};


  return (
    <FormContainer>
      <Title>+ Add Changes</Title>
      <form onSubmit={handleSubmit}>
        {/* ✅ Dropdown for Change Type */}
        <InputGroup>
          <StyledLabel>Change Type</StyledLabel>
          <StyledSelect
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
          >
            <option value="Maintenance">Maintenance</option>
            <option value="Accident">Accident</option>
            <option value="Modding">Modding</option>
            <option value="Repairs">Repairs</option>
            <option value="Damages">Damages</option>
          </StyledSelect>
        </InputGroup>

        {/* ✅ Input for Details */}
        <InputGroup>
          <StyledLabel>Details</StyledLabel>
          <LInput
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe the changes made..."
          />
        </InputGroup>

        {/* ✅ Input for Cost */}
        <InputGroup>
          <StyledLabel>Cost (PHP)</StyledLabel>
          <LInput
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </InputGroup>

        {/* ✅ Date Selection */}
        <InputGroup>
          <StyledLabel>Select Date</StyledLabel>
          <DateDropdownContainer>
            <DateDropdown value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {getMonths().map((month, index) => <option key={index} value={index}>{month}</option>)}
            </DateDropdown>
            <DateDropdown value={selectedDay} onChange={(e) => setSelectedDay(parseInt(e.target.value))}>
              {getDays().map((day) => <option key={day} value={day}>{day}</option>)}
            </DateDropdown>
            <DateDropdown value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {getYears().map((year) => <option key={year} value={year}>{year}</option>)}
            </DateDropdown>
          </DateDropdownContainer>
        </InputGroup>

        <CenteredContainer>
  {/* ✅ Prevents form submission when clicking */}
  <UploadButton type="button" onClick={() => setShowModal(true)}>+ UPLOAD IMAGE</UploadButton>

  {/* ✅ Pass `selectedVehicle?.usersRV_ID` only when it exists */}
  {showModal && selectedVehicle && (
    <ImageUploadModal 
      onClose={() => setShowModal(false)} 
      onUpload={setUploadedImage} 
      usersRV_ID={selectedVehicle.usersRV_ID} // ✅ Ensures Vehicle ID is passed properly
    />
  )}

  {/* ✅ This button should handle form submission */}
  <SubmitButton type="submit">+ SUBMIT CHANGES</SubmitButton>
</CenteredContainer>


      </form>
    </FormContainer>
  );
};

export default Changes;
