import { WeatherData } from "@/types/weather-data";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  const weatherIcon = weatherData?.currentConditions?.icon || "clear-day";
  const backgroundImage =
    backgroundImageMap[weatherIcon] || backgroundImageMap["clear-day"];

  const [currentBackground, setCurrentBackground] = useState(backgroundImage);

  useEffect(() => {
    if (backgroundImage !== currentBackground) {
      setCurrentBackground(backgroundImage);
    }
  }, [backgroundImage, currentBackground]);

  return (
    <motion.main
      className="flex items-center justify-center min-h-screen p-2 bg-cover"
      style={{ backgroundImage: `url('${currentBackground}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      key={currentBackground}
    >
      {children}
    </motion.main>
  );
};

export default RootLayout;
