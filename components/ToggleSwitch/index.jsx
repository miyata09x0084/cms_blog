import React, { useState } from "react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";
import { Box } from "@chakra-ui/react";

function ToggleSwitch({ toggleTheme }) {
  const [isToggled, setIsToggled] = useState(false);

  const onToggle = () => {
    setIsToggled(!isToggled);
    toggleTheme();
  };

  return (
    <Box
      className="toggle-container"
      px={{base: 8, md: 0}}
      maxW="768px"
      mx="auto"
    >
      <button
        className={`theme-toggle-button ${isToggled ? "sun" : "moon"}`}
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        {isToggled ? <SunIcon /> : <MoonIcon />}
      </button>
    </Box>
  );
}

export default ToggleSwitch;
