import React from "react";
import { Card } from "@/components/ui/card";

interface LocationTempProps {
  temperature: number;
  location: string;
  tempMin: number;
  tempMax: number;
  isCelsius: boolean; // Add isCelsius prop
}

export const LocationDaysTemperature: React.FC<LocationTempProps> = ({
  temperature,
  location,
  tempMin,
  tempMax,
  isCelsius,
}) => {
  // Calculate the percentage width for the temperature bars
  const getTemperatureWidth = (temp: number, isCelsius: boolean) => {
    // Define temperature ranges for Celsius and Fahrenheit
    const minPossible = isCelsius ? -20 : -4; // -20°C or -4°F
    const maxPossible = isCelsius ? 50 : 122; // 50°C or 122°F
    const range = maxPossible - minPossible;
    const percentage = ((temp - minPossible) / range) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
  };

  // Get background color based on temperature
  const getTemperatureColor = (temp: number, isCelsius: boolean) => {
    if (isCelsius) {
      // Celsius thresholds
      if (temp >= 51.67) return "bg-red-500"; // 51.67°C (125°F)
      if (temp >= 39.44) return "bg-orange-500"; // 39.44°C (103°F)
      if (temp >= 32.22) return "bg-yellow-500"; // 32.22°C (90°F)
      if (temp >= 26.67) return "bg-amber-200"; // 26.67°C (80°F)
      return "bg-blue-300"; // Below 26.67°C
    } else {
      // Fahrenheit thresholds
      if (temp >= 125) return "bg-red-500"; // 125°F
      if (temp >= 103) return "bg-orange-500"; // 103°F
      if (temp >= 90) return "bg-yellow-500"; // 90°F
      if (temp >= 80) return "bg-amber-200"; // 80°F
      return "bg-blue-300"; // Below 80°F
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-3xl xl:text-4xl">
          {temperature}°{isCelsius ? "C" : "F"}
        </h3>
        <p className="text-xs md:text-sm">{location}</p>
        <div className="space-y-1 w-full">
          {/* High temp */}
          <div className="h-1 rounded-full overflow-hidden bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${getTemperatureColor(
                tempMax,
                isCelsius
              )}`}
              style={{ width: `${getTemperatureWidth(tempMax, isCelsius)}%` }}
            />
          </div>
          {/* Low temp */}
          <div className="h-1 rounded-full overflow-hidden bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${getTemperatureColor(
                tempMin,
                isCelsius
              )}`}
              style={{ width: `${getTemperatureWidth(tempMin, isCelsius)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
