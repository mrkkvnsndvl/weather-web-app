import { useState, useEffect } from "react";
import { fetchWeatherData } from "../services/api";

export const useWeatherData = (location: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if data is already cached
        const cachedData = localStorage.getItem(location);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (isMounted) {
            setData(parsedData);
          }
        } else {
          const result = await fetchWeatherData(location);
          if (isMounted) {
            setData(result);
            // Cache the result
            localStorage.setItem(location, JSON.stringify(result));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
};
