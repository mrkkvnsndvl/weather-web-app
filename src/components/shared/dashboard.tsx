import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CloudFogIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSnowIcon,
  WindIcon,
} from "lucide-react";
import moment from "moment-timezone";
import React, { memo, useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import { DaysTemperatureCard } from "./days-temperature-card";
import ToggleTemperature from "./toggle-temperature";

interface DashboardProps {
  weatherData: any;
  isCelsius: boolean;
  onToggleTemperatureUnit: () => void;
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

    const chartData = useMemo(() => {
      return (
        weatherData?.days.map((day: any) => ({
          day: moment.tz(day.datetime, timezone).format("MMM D"),
          temperature: isCelsius
            ? Math.round(((day.temp - 32) * (5 / 9) + Number.EPSILON) * 100) /
              100
            : day.temp,
        })) || []
      );
    }, [weatherData, timezone, isCelsius]);

    const renderWeatherIcon = () => {
      switch (weatherData?.currentConditions?.icon) {
        case "snow":
          return <CloudSnowIcon className="w-6 h-6 text-white" />;
        case "rain":
          return <CloudRainIcon className="w-6 h-6 text-white" />;
        case "fog":
          return <CloudFogIcon className="w-6 h-6 text-white" />;
        case "wind":
          return <WindIcon className="w-6 h-6 text-white" />;
        case "cloudy":
        case "partly-cloudy-day":
        case "partly-cloudy-night":
        case "clear-day":
        case "clear-night":
          return <CloudIcon className="w-6 h-6 text-white" />;
        default:
          return null;
      }
    };

    return (
      <section className="w-full min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center justify-between w-full">
              <span className="block font-medium tracking-wider text-white uppercase opacity-70">
                Weather Forecast
              </span>
              <ToggleTemperature onToggle={onToggleTemperatureUnit} />
            </div>
            <div className="flex flex-col gap-2 mt-6 md:mt-10">
              <h1 className="text-4xl leading-tight text-white md:text-6xl">
                {weatherData?.currentConditions?.conditions}
              </h1>
            </div>
          </header>

          {/* Weather Details */}
          <div className="mt-6 md:mt-10">
            <div className="flex items-center gap-2 mb-4">
              {renderWeatherIcon()}
              <span className="text-xs text-white md:text-sm">
                {weatherData?.resolvedAddress},{" "}
                {moment
                  .tz(weatherData?.days?.[0]?.datetime, timezone)
                  .format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="max-w-xl">
              <p className="mb-2 text-sm text-white md:text-base">
                {weatherData?.description}
              </p>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl text-white md:text-5xl">
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
                  <p className="text-xs text-white md:text-sm">
                    Precipitation:&nbsp;
                    {weatherData?.days[0]?.precipprob}%.
                  </p>
                </div>
                <span className="text-xs text-white md:text-sm">Feelslike</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <section>
            <Card className="h-40 p-4 mt-6 md:mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig}>
                  <LineChart accessibilityLayer data={chartData}>
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
          <div className="grid grid-cols-3 gap-4 mt-6 md:grid-cols-4 lg:grid-cols-8 md:mt-10">
            {weatherData?.days.map((day: any) => {
              const tempC = Math.round(((day.temp - 32) * 5) / 9);
              const tempMinC = Math.round(((day.tempmin - 32) * 5) / 9);
              const tempMaxC = Math.round(((day.tempmax - 32) * 5) / 9);

              return (
                <DaysTemperatureCard
                  key={day.datetime}
                  temperature={isCelsius ? tempC : day.temp}
                  location={moment.tz(day.datetime, timezone).format("MMMM D")}
                  tempMin={isCelsius ? tempMinC : day.tempmin}
                  tempMax={isCelsius ? tempMaxC : day.tempmax}
                  isCelsius={isCelsius}
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