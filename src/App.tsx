import { useCallback, useEffect, useState } from "react";
import Dashboard from "./components/shared/dashboard";
import LeftAside from "./components/shared/left-aside";
import Loading from "./components/shared/loading";
import { Card } from "./components/ui/card";
import { useWeatherData } from "./hooks/useWeatherData";
import RootLayout from "./layouts/root-layout";

const App = () => {
  const [location, setLocation] = useState("Philippines");
  const [isCelsius, setIsCelsius] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);

  const { data: weatherData, loading, error } = useWeatherData(location);

  useEffect(() => {
    if (loading) {
      setLoadingDelay(true);

      const timer = setTimeout(() => {
        setLoadingDelay(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setLoadingDelay(false);
    }
  }, [loading]);

  const handleLocationChange = useCallback((newLocation: string) => {
    setLocation(newLocation);
  }, []);

  const handleToggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  return (
    <RootLayout weatherData={weatherData}>
      <Card className="flex flex-col w-full min-h-screen bg-transparent xl:flex-row">
        {loading || loadingDelay ? (
          <Loading />
        ) : error ? (
          <div className="flex items-center justify-center w-full text-red-500">
            {error.message === "Too many requests. Please try again later."
              ? "Too many requests. Please try again later."
              : "Failed to fetch weather data. Please try again."}
          </div>
        ) : (
          <>
            <LeftAside
              weatherData={weatherData}
              onLocationChange={handleLocationChange}
              isCelsius={isCelsius}
            />
            <Dashboard
              weatherData={weatherData}
              isCelsius={isCelsius}
              onToggleTemperatureUnit={handleToggleTemperatureUnit}
            />
          </>
        )}
      </Card>
    </RootLayout>
  );
};

export default App;
