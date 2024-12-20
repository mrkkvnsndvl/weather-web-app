import { useEffect, useState } from "react";
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
        const cachedData = localStorage.getItem(location);
        if (cachedData) {
          setData(JSON.parse(cachedData));
        } else {
          const result = await fetchWeatherData(location);
          if (isMounted) {
            setData(result);
            localStorage.setItem(location, JSON.stringify(result));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 2000);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
};