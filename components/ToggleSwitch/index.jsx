import React, { useState } from "react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

function ToggleSwitch({ toggleTheme }) {
  const [isToggled, setIsToggled] = useState(false);

  const onToggle = () => {
    setIsToggled(!isToggled);
    toggleTheme();
  };

  return (
    <div className="toggle-container">
      <button
        className={`theme-toggle-button ${isToggled ? "sun" : "moon"}`}
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        {isToggled ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}

export default ToggleSwitch;
