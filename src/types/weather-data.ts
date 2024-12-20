export interface WeatherData {
  currentConditions: {
    temp: number;
    feelslike: number;
    conditions: string;
    icon: string;
    humidity: number;
    windspeed: number;
  };
  days: Array<{
    datetime: string;
    temp: number;
    tempmin: number;
    tempmax: number;
    description: string;
  }>;
  resolvedAddress: string;
  timezone: string;
}
