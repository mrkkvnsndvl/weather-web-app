import { API_KEY, BASE_URL } from "../constants/api";

export const fetchWeatherData = async (location: string) => {
  const url = `${BASE_URL}/${location}?unitGroup=us&key=${API_KEY}&contentType=json`;
  const response = await fetch(url);

  if (response.status === 429) {
    throw new Error("Too many requests. Please try again later.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
};
