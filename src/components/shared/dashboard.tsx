import React, { memo, useMemo } from "react";
import {
  CloudFogIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSnowIcon,
  WindIcon,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import { Card } from "@/components/ui/card";
import moment from "moment-timezone";
import { LocationDaysTemperature } from "./location-days-temperature";
import ToggleTemperature from "./toggle-temperature";

interface DashboardProps {
  weatherData: any;
  isCelsius: boolean; // Add isCelsius prop
  onToggleTemperatureUnit: () => void; // Add toggle function prop
}

const Dashboard: React.FC<DashboardProps> = memo(
  ({ weatherData, isCelsius, onToggleTemperatureUnit }) => {
    const chartConfig = {
      temperature: {
        label: "Temperature",
        color: "hsl(var(--chart-4))",
      },
    } satisfies ChartConfig;

    const timezone = weatherData?.timezone || "UTC";

    // Use useMemo to optimize expensive calculations
    const chartData = useMemo(() => {
      return (
        weatherData?.days.map((day: any) => ({
          day: moment.tz(day.datetime, timezone).format("MMM D"), // Format day as Month Day
          temperature: isCelsius
            ? Math.round(((day.temp - 32) * (5 / 9) + Number.EPSILON) * 100) /
              100
            : day.temp,
        })) || []
      );
    }, [weatherData, timezone, isCelsius]);
    return (
      <section className="p-4 md:p-6 lg:p-8 w-full min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center justify-between w-full">
              <span className="block font-medium text-white uppercase tracking-wider opacity-70">
                Weather Forecast
              </span>
              <ToggleTemperature onToggle={onToggleTemperatureUnit} />
            </div>
            <div className="flex flex-col gap-2 mt-6 md:mt-10">
              <h1 className="text-4xl md:text-6xl text-white leading-tight">
                {weatherData?.currentConditions?.conditions}
              </h1>
            </div>
          </header>

          {/* Weather Details */}
          <div className="mt-6 md:mt-10">
            <div className="flex items-center gap-2 mb-4">
              {weatherData?.currentConditions?.icon === "snow" ? (
                <CloudSnowIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "rain" ? (
                <CloudRainIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "fog" ? (
                <CloudFogIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "wind" ? (
                <WindIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "cloudy" ? (
                <CloudIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon ===
                "partly-cloudy-day" ? (
                <CloudIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon ===
                "partly-cloudy-night" ? (
                <CloudIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "clear-day" ? (
                <CloudIcon className="text-white w-6 h-6" />
              ) : weatherData?.currentConditions?.icon === "clear-night" ? (
                <CloudIcon className="text-white w-6 h-6" />
              ) : null}
              <span className="text-xs md:text-sm text-white">
                {weatherData?.resolvedAddress},{" "}
                {moment
                  .tz(weatherData?.days?.datetime, timezone)
                  .format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="max-w-xl">
              <p className="text-white mb-2 text-sm md:text-base">
                {weatherData?.description}
              </p>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl md:text-5xl text-white">
                    {isCelsius
                      ? Math.round(
                          ((weatherData?.currentConditions?.feelslike - 32) *
                            5) /
                            9 +
                            Number.EPSILON
                        )
                      : weatherData?.currentConditions?.feelslike}
                    °{isCelsius ? "C" : "F"}
                  </h2>
                  <p className="text-xs md:text-sm text-white">
                    Precipitation:
                    {weatherData?.days[0]?.precipprob}%.
                  </p>
                </div>
                <span className="text-xs md:text-sm text-white">Feelslike</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <section>
            <Card className="h-40 mt-6 md:mt-10 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      className="text-white"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="temperature"
                      type="natural"
                      stroke="var(--color-temperature)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </Card>
          </section>

          {/* 24-hour Forecast (Now showing daily forecast) */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6 md:mt-10">
            {weatherData?.days.map((day: any) => {
              const tempC = Math.round(((day.temp - 32) * 5) / 9);
              const tempMinC = Math.round(((day.tempmin - 32) * 5) / 9);
              const tempMaxC = Math.round(((day.tempmax - 32) * 5) / 9);

              return (
                <LocationDaysTemperature
                  key={day.datetime}
                  temperature={isCelsius ? tempC : day.temp}
                  location={moment
                    .tz(weatherData?.days?.datetime, timezone)
                    .format("MMMM D")}
                  tempMin={isCelsius ? tempMinC : day.tempmin}
                  tempMax={isCelsius ? tempMaxC : day.tempmax}
                  isCelsius={false}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);

export default Dashboard;
