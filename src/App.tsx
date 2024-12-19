// App.tsx
import { useCallback, useState } from "react";
import Dashboard from "./components/shared/dashboard";
import LeftAside from "./components/shared/left-aside";
import { Card } from "./components/ui/card";
import { useWeatherData } from "./hooks/useWeatherData";
import RootLayout from "./layouts/root-layout";
import Loading from "./components/shared/loading"; // Import Loading component

const App = () => {
  const [location, setLocation] = useState("Philippines");
  const [isCelsius, setIsCelsius] = useState(true); // State to manage temperature unit

  const { data: weatherData, loading, error } = useWeatherData(location);

  const handleLocationChange = useCallback((newLocation: string) => {
    setLocation(newLocation);
  }, []);

  const handleToggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  return (
    <RootLayout weatherData={weatherData}>
      <Card className="flex flex-col xl:flex-row w-full min-h-screen bg-transparent">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-red-500 flex items-center justify-center w-full">
            {error.message === "Too many requests. Please try again later."
              ? "Too many requests. Please try again later."
              : "Failed to fetch weather data. Please try again."}
          </div>
        ) : (
          <>
            <LeftAside
              weatherData={weatherData}
              onLocationChange={handleLocationChange}
              isCelsius={isCelsius} // Pass the temperature unit state
            />
            <Dashboard
              weatherData={weatherData}
              isCelsius={isCelsius} // Pass the temperature unit state
              onToggleTemperatureUnit={handleToggleTemperatureUnit} // Pass the toggle function
            />
          </>
        )}
      </Card>
    </RootLayout>
  );
};

export default App;
