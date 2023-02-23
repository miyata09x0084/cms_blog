import styled from "styled-components";

const StyledColor = styled.div`
  min-height: 100vh;
  background-color: ${(props => props.theme.body)};
  color: ${(props => props.theme.font)};
`;

const darkTheme = {
  body: "#333333",
  font: "#6FEFDE",
  site: "#ffffff",
  sun: "#b6b6b6",
  moon: "#b6b6b6",
  title: "#6FEFDE",
  day: "#ffffff",
  article: "#ffffff",
}

const lightTheme = {
  body: "#ffffff",
  font: "#444444",
  site: "#444444",
  sun: "#444444",
  moon: "#444444",
  title: "#327AB7",
  day: "#444444",
  article: "#444444",
}

export { StyledColor, darkTheme, lightTheme };