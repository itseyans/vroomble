import styled from "styled-components";

const BackgroundContainer = styled.div`
  background-image: url('/Vflag.png'); /* Correct path */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: -1;
`;


export default function Background() {
  return (
    <BackgroundContainer>
    </BackgroundContainer>
  );
}

