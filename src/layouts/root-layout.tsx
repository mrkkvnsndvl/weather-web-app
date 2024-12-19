import React from "react";
import { WeatherData } from "@/types/weatherData";

interface RootLayoutProps {
  children: React.ReactNode;
  weatherData: WeatherData | null;
}

const backgroundImageMap: Record<string, string> = {
  snow: "/images/snow.jpg",
  rain: "/images/rain.jpg",
  fog: "/images/fog.jpg",
  wind: "/images/wind.jpg",
  cloudy: "/images/cloudy.jpg",
  "partly-cloudy-day": "/images/partly-cloudy-day.jpg",
  "partly-cloudy-night": "/images/partly-cloudy-night.jpg",
  "clear-day": "/images/clear-day.jpg",
  "clear-night": "/images/clear-night.jpg",
};

const RootLayout: React.FC<RootLayoutProps> = ({ children, weatherData }) => {
  // Get the current weather icon
  const weatherIcon = weatherData?.currentConditions?.icon || "clear-day";

  // Get the corresponding background image URL
  const backgroundImage =
    backgroundImageMap[weatherIcon] || backgroundImageMap["clear-day"];

  return (
    <main
      className="p-2 flex justify-center items-center bg-cover min-h-screen"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {children}
    </main>
  );
};

export default RootLayout;
