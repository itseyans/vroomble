import React from 'react';
import styled from 'styled-components';
import ApproveButton from '../vcomp/ApproveButton';
import RejectButton from '../vcomp/RejectButton';
import { useNavigate } from 'react-router-dom'; // Or your routing method

const VehicleCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VehicleInfo = styled.div`
  flex-grow: 1;
`;

const VehicleActions = styled.div`
  display: flex;
`;

const VehicleCardComponent = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleSeeDetails = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`); // Navigate to details page
  };

  return (
    <VehicleCard key={vehicle.id}>
      <VehicleInfo>
        <h2>{vehicle.model}</h2>
        <p>Condition: {vehicle.condition}</p>
        <button onClick={() => handleSeeDetails(vehicle.id)}>
          See Full Details
        </button>
      </VehicleInfo>
      <VehicleActions>
        <RejectButton vehicleId={vehicle.id} />
        <ApproveButton vehicleId={vehicle.id} />
      </VehicleActions>
    </VehicleCard>
  );
};

export default VehicleCardComponent;