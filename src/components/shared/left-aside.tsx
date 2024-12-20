import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SearchIcon, ThermometerIcon } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";

interface LeftAsideProps {
  weatherData: any;
  onLocationChange: (location: string) => void;
  isCelsius: boolean;
}

const LeftAside: React.FC<LeftAsideProps> = ({
  weatherData,
  onLocationChange,
  isCelsius,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchInput.trim()) {
        onLocationChange(searchInput);
        setSearchInput("");
      }
    },
    [onLocationChange, searchInput]
  );

  const chartConfig = {
    temperature: {
      label: "Temperature",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    return (
      weatherData?.days[0]?.hours.map((hour: any) => ({
        hour: new Date(`1970-01-01T${hour.datetime}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        temperature: isCelsius
          ? Math.round(((hour.temp - 32) * (5 / 9) + Number.EPSILON) * 100) /
            100
          : hour.temp,
      })) || []
    );
  }, [weatherData, isCelsius]);

  const currentTemp = isCelsius
    ? ((weatherData?.currentConditions?.temp - 32) * 5) / 9
    : weatherData?.currentConditions?.temp;

  const getTemperatureColor = (temp: number, isCelsius: boolean) => {
    if (isCelsius) {
      if (temp >= 51.67) return "bg-red-500";
      if (temp >= 39.44) return "bg-orange-500";
      if (temp >= 32.22) return "bg-yellow-500";
      if (temp >= 26.67) return "bg-amber-200";
      return "bg-blue-300";
    } else {
      if (temp >= 125) return "bg-red-500";
      if (temp >= 103) return "bg-orange-500";
      if (temp >= 90) return "bg-yellow-500";
      if (temp >= 80) return "bg-amber-200";
      return "bg-blue-300";
    }
  };

  const getRiskLevelThresholds = (isCelsius: boolean) => {
    return isCelsius
      ? [
          { label: "Normal", color: "bg-blue-300", range: "27°C or below" },
          { label: "Caution", color: "bg-amber-200", range: "27°C - 32°C" },
          {
            label: "Extreme Caution",
            color: "bg-yellow-500",
            range: "32°C - 39°C",
          },
          { label: "Danger", color: "bg-orange-500", range: "39°C - 51°C" },
          {
            label: "Extreme Danger",
            color: "bg-red-500",
            range: "51°C or higher",
          },
        ]
      : [
          { label: "Normal", color: "bg-blue-300", range: "80°F or below" },
          { label: "Caution", color: "bg-amber-200", range: "80°F - 90°F" },
          {
            label: "Extreme Caution",
            color: "bg-yellow-500",
            range: "90°F - 103°F",
          },
          { label: "Danger", color: "bg-orange-500", range: "103°F - 125°F" },
          {
            label: "Extreme Danger",
            color: "bg-red-500",
            range: "125°F or higher",
          },
        ];
  };

  const riskLevels = getRiskLevelThresholds(isCelsius);

  return (
    <aside
      aria-label="Weather and Air Quality Information"
      className="w-full xl:max-w-sm"
    >
      <Card className="min-h-screen p-4 bg-transparent md:p-6 lg:p-8">
        <CardHeader className="p-0 mb-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <ThermometerIcon
              className="w-8 h-8 text-white md:h-10 md:w-10"
              aria-hidden="true"
            />
            <div className="flex-grow">
              <Input
                type="text"
                aria-label="Location search"
                className="w-full text-white bg-transparent border-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-slate-300"
                placeholder="Enter Location"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-white transition-colors duration-300 hover:text-black"
            >
              <SearchIcon
                className="w-5 h-5 md:h-6 md:w-6"
                aria-hidden="true"
              />
            </Button>
          </form>
          <Separator className="mt-2 rounded-full" />
        </CardHeader>

        <CardContent className="p-0 space-y-16">
          {/* Temperature Display */}
          <section className="flex items-center justify-center">
            <h2 className="text-6xl text-white md:text-8xl">
              {currentTemp.toFixed(1)}°{isCelsius ? "C" : "F"}
            </h2>
          </section>

          {/* Wind Speed Section */}
          <section className="flex items-end justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-white">Humidity</span>
              <h4 className="flex flex-col text-2xl text-white md:text-4xl">
                {weatherData?.currentConditions?.humidity}%
              </h4>
            </div>

            <p className="text-xs text-white md:text-sm">
              Wind:&nbsp;
              {weatherData?.currentConditions?.windspeed}&nbsp;mph
            </p>
          </section>

          {/* Temperature Indicator Section */}
          <section className="flex flex-col justify-between gap-4">
            <div className="flex items-end justify-between">
              <div className="relative flex items-center">
                <div className="w-6 h-6 bg-blue-300 rounded-full md:w-8 md:h-8" />
                <div className="w-6 h-6 -translate-x-2 rounded-full md:w-8 md:h-8 bg-amber-200" />
                <div className="w-6 h-6 -translate-x-4 bg-yellow-500 rounded-full md:w-8 md:h-8" />
                <div className="w-6 h-6 -translate-x-6 bg-orange-500 rounded-full md:w-8 md:h-8" />
                <div className="w-6 h-6 -translate-x-8 bg-red-500 rounded-full md:w-8 md:h-8" />
              </div>
              <div className="flex items-center space-x-1">
                <div
                  className={`w-1 h-1 rounded-full ${getTemperatureColor(
                    currentTemp,
                    isCelsius
                  )}`}
                />
                <h5 className="text-xl text-white md:text-2xl">
                  {currentTemp.toFixed(1)}°{isCelsius ? "C" : "F"}
                </h5>
              </div>
            </div>
            {/* Risk Levels Section  */}
            <div className="grid grid-cols-2 gap-2">
              {riskLevels.map((level, index) => (
                <div key={index}>
                  <h6 className="text-sm text-white">{level.label}</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1 h-1 rounded-full ${level.color}`} />
                      <span className="text-xs text-white md:text-sm">
                        {level.range}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chart Section */}
          <section>
            <Card className="w-full h-40 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig}>
                  <LineChart accessibilityLayer data={chartData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value}
                      className="text-white"
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

          {/* Location Description */}
          <section>
            <h4 className="text-lg text-white md:text-xl">
              {weatherData?.resolvedAddress}
            </h4>
            <p className="mt-1 text-xs text-white md:text-sm">
              {weatherData?.days[0]?.description}
            </p>
          </section>
        </CardContent>
      </Card>
    </aside>
  );
};

export default React.memo(LeftAside);