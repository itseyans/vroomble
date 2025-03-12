import React, { useState } from "react";
import styled from "styled-components";
import SelectDate from "@/vcomp/SelectDate";
import GeneralButton from "@/vcomp/GeneralButton";
import ImageUploadModal from "@/vcomp/ImageUploadModal";

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
  color: black; /* ✅ Ensures title is black */
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  color: black; /* ✅ Ensures input group labels are black */
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: black; /* ✅ Ensures labels are black */
`;

const LInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  color: black; /* ✅ Ensures input text is black */
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
  font-size: 14px;
  color: black; /* ✅ Ensures button text is black */

  &:hover {
    background-color: #ffdf70;
  }
`;

const SubmitButton = styled(GeneralButton)`
  margin-top: 30px;
  width: 200px;
  font-size: 16px;
  display: ${(props) => (props.isCalendarOpen ? "none" : "block")};
  color: black; /* ✅ Ensures button text is black */
`;

const Changes = () => {
  const [part, setPart] = useState("");
  const [cost, setCost] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageUpload = (image) => {
    setUploadedImage(image);
  };

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

        <CenteredContainer>
          <UploadButton onClick={handleUploadButtonClick}>
            + UPLOAD IMAGES
          </UploadButton>
          {showModal && (
            <ImageUploadModal
              onClose={handleModalClose}
              onUpload={handleImagesUpload}
            />
          )}

          <SelectDate
            onChange={setSelectedDate}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
          />

          <SubmitButton type="submit" isCalendarOpen={isCalendarOpen}>
            + SUBMIT CHANGES
          </SubmitButton>
        </CenteredContainer>
      </form>
    </FormContainer>
  );
};

export default Changes;
