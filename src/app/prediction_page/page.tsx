"use client"; // ✅ Ensure Client-Side Rendering

import React from "react";
import styled from "styled-components";
import Background from "../../vcomp/Background"; // ✅ Background component
import NavBar from "../../vcomp/NavBar"; // ✅ Navigation Bar component
import GeneralButton from "../../vcomp/GeneralButton";
import usePredict from "../../vcomp/Predict"; // ✅ Importing the hook properly

/** Styled Components */
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: white;
`;

const Button = styled(GeneralButton)`
  width: 100%;
`;

/** Styled box for output */
const ResultBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const PredictForm = () => {
  const {
    carMakers,
    carModels,
    selectedMaker,
    setSelectedMaker,
    selectedModel,
    setSelectedModel,
    months,
    setMonths,
    prediction,
    fetchPrediction,
    loading,
    hydration,
  } = usePredict(); // ✅ Use the hook inside

  /** Prevent rendering until hydration is complete */
  if (!hydration) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* Background & Navbar at the top */}
      <NavBar />
      <Background />

      {/* Prediction Form Section */}
      <Container>
        <Header>Dream Car Creator & Cost Estimator</Header>
        <Form onSubmit={(e) => { e.preventDefault(); fetchPrediction(); }}>
          {/* Car Maker Dropdown */}
          <Dropdown value={selectedMaker} onChange={(e) => setSelectedMaker(e.target.value)} required>
            <option value="">Select Car Maker</option>
            {carMakers.map((maker, index) => (
              <option key={index} value={maker}>
                {maker}
              </option>
            ))}
          </Dropdown>

          {/* Car Model Dropdown */}
          <Dropdown value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
            <option value="">Select Car Model</option>
            {carModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </Dropdown>

          {/* Months Input */}
          <Dropdown value={months} onChange={(e) => setMonths(e.target.value)} required>
            <option value="">Enter number of months</option>
            {[1, 3, 6, 12, 24].map((month, index) => (
              <option key={index} value={month}>
                {month} months
              </option>
            ))}
          </Dropdown>

          {/* Submit Button */}
          <Button type="submit">{loading ? "Loading..." : "Get Prediction"}</Button>
        </Form>

        {/* Display the Prediction Result */}
        {prediction !== null && <ResultBox>Predicted Price: ${parseFloat(prediction).toFixed(2)}</ResultBox>}
      </Container>
    </>
  );
};

export default PredictForm; // ✅ Correctly export the component
