import React, { useState } from "react";
import styled from "styled-components";

// Styled Container for Zoom Effect
const ZoomContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ZoomImage = styled.img`
  width: 100%;
  transition: transform 0.3s ease-in-out;
  transform: ${(props) => (props.hovered ? "scale(1.5)" : "scale(1)")};
  transform-origin: ${(props) => props.position.x} ${(props) => props.position.y};
`;

const HoverZoom = ({ imageUrl }) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: "50%", y: "50%" });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <ZoomContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <ZoomImage src={imageUrl} alt="Car Image" hovered={hovered} position={position} />
    </ZoomContainer>
  );
};

export default HoverZoom;
