import React, { useState } from "react";
import { Button } from "../ui/button";

interface ToggleTemperatureProps {
  onToggle: (isCelsius: boolean) => void;
}

const ToggleTemperature: React.FC<ToggleTemperatureProps> = ({ onToggle }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const handleToggle = () => {
    const newUnit = !isCelsius;
    setIsCelsius(newUnit);
    onToggle(newUnit); // Notify the parent component of the change
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white"
      onClick={handleToggle}
    >
      {isCelsius ? "°C" : "°F"}
    </Button>
  );
};

export default ToggleTemperature;
