import React, { useState } from "react";
import styled from "styled-components";
import SelectDate from "../SelectDate";
import GeneralButton from "../GeneralButton";
import ImageUploadModal from "../ImageUploadModal";

const FormContainer = styled.div`
  width: 350px;
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
  margin-bottom: 40px;
  padding-top: 30px;
  padding-bottom: 10px;
  font-size: 2em;
  border-bottom: 2px solid #ccc;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const LInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const UploadButton = styled(GeneralButton)`
  background-color: #f0f0e0;
  padding: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 30px;
  width: 160px;
  font-size: 14px; // Reduced font size for UploadButton
`;

const SubmitButton = styled(GeneralButton)`
  margin-top: 30px;
  width: 200px;
  font-size: 16px; // Reduced font size for SubmitButton
  display: ${(props) => (props.isCalendarOpen ? "none" : "block")};
`;

const Changes = () => {
  const [part, setPart] = useState("");
  const [cost, setCost] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false); // Correct state variable name

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

  const handleUploadButtonClick = () => {
    setShowModal(!showModal); // Correct state variable name
  };

  const handleModalClose = () => {
    setShowModal(false); // Correct state variable name
  };

  const handleImagesUpload = (images) => {
    setUploadedImage(images);
    setShowModal(false); // Correct state variable name
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Part:", part);
    console.log("Cost:", cost);
    console.log("Date:", selectedDate);
  };

  return (
    <FormContainer>
      <Title>+ Add Changes</Title>
      <form onSubmit={handleSubmit}>

        {/*Forms for Parts and Cost */}
        <InputGroup>
          <StyledLabel>PART</StyledLabel>
          <LInput
            type="text"
            value={part}
            onChange={(e) => setPart(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <StyledLabel>COST</StyledLabel>
          <LInput
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </InputGroup>

        {/* Upload Image for Parts and Cost */}
        <CenteredContainer>
          <UploadButton onClick={handleUploadButtonClick}>
            + UPLOAD IMAGES
          </UploadButton>
          {showModal && ( // Correct state variable name
            <ImageUploadModal
              onClose={handleModalClose}
              onUpload={handleImagesUpload}
            />
          )}

          {/*SelectDate, an open up calendar for selecting date*/}
          <SelectDate
            onChange={setSelectedDate}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
          />

          {/*Button for submitting the changes*/}
          <SubmitButton type="submit" isCalendarOpen={isCalendarOpen}>
            + SUBMIT CHANGES
          </SubmitButton>
        </CenteredContainer>
      </form>
    </FormContainer>
  );
};

export default Changes;