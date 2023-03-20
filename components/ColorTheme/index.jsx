import styled from "styled-components";

const StyledColor = styled.div`
  min-height: 100vh;
  background-color: ${(props => props.theme.body)};
  color: ${(props => props.theme.font)};
`;

const darkTheme = {
  body: "var(--dark-bg)",
  font: "var(--dark-text)",
  sun: "var(--moon-icon)",
  title: "var(--dark-text-sub)",
  day: "var(--dark-text)",
  article: "var(--dark-text)",
  space: "var(--dark-bg-sub)",
}

const lightTheme = {
  body: "var(--primary-bg)",
  font: "var(--primary-text)",
  moon: "var(--sun-icon)",
  title: "var(--primary-text)",
  day: "var(--primary-text)",
  article: "var(--primary-text)",
  space: "var(--secondary-bg)",
}

export { StyledColor, darkTheme, lightTheme };