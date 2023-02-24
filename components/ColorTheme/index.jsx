import styled from "styled-components";

const StyledColor = styled.div`
  min-height: 100vh;
  background-color: ${(props => props.theme.body)};
  color: ${(props => props.theme.font)};
`;

const darkTheme = {
  body: "#222222",
  font: "#6FEFDE",
  site: "#eeeeee",
  sun: "#b6b6b6",
  moon: "#b6b6b6",
  title: "#6FEFDE",
  day: "#eeeeee",
  article: "#eeeeee",
}

const lightTheme = {
  body: "#fffefb",
  font: "#555555",
  site: "#222222",
  sun: "#555555",
  moon: "#555555",
  title: "#327AB7",
  day: "#555555",
  article: "#555555",
}

export { StyledColor, darkTheme, lightTheme };