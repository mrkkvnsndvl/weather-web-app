import React, { useState, useCallback, useMemo } from "react";
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
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";

interface LeftAsideProps {
  weatherData: any;
  onLocationChange: (location: string) => void;
  isCelsius: boolean; // Add isCelsius prop
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
          ? Math.round(((hour.temp - 32) * (5 / 9) + Number.EPSILON) * 100) / 100
          : hour.temp,
      })) || []
    );
  }, [weatherData, isCelsius]);

  // Convert temperature to Celsius if needed
  const currentTemp = isCelsius
    ? ((weatherData?.currentConditions?.temp - 32) * 5) / 9
    : weatherData?.currentConditions?.temp;

  // Get background color based on temperature
  const getTemperatureColor = (temp: number, isCelsius: boolean) => {
    if (isCelsius) {
      // Celsius thresholds
      if (temp >= 51.67) return "bg-red-500"; // 51.67°C (125°F)
      if (temp >= 39.44) return "bg-orange-500"; // 39.44°C (103°F)
      if (temp >= 32.22) return "bg-yellow-500"; // 32.22°C (90°F)
      if (temp >= 26.67) return "bg-amber-200"; // 26.67°C (80°F)
      return "bg-blue-300"; // Below 26.67°C
    } else {
      // Fahrenheit thresholds
      if (temp >= 125) return "bg-red-500"; // 125°F
      if (temp >= 103) return "bg-orange-500"; // 103°F
      if (temp >= 90) return "bg-yellow-500"; // 90°F
      if (temp >= 80) return "bg-amber-200"; // 80°F
      return "bg-blue-300"; // Below 80°F
    }
  };

  return (
    <aside
      aria-label="Weather and Air Quality Information"
      className="w-full xl:max-w-sm "
    >
      <Card className="min-h-screen bg-transparent p-4 md:p-6">
        <CardHeader className="pb-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <ThermometerIcon
              className="h-8 w-8 md:h-10 md:w-10 text-white"
              aria-hidden="true"
            />
            <div className="flex-grow">
              <Input
                type="text"
                aria-label="Location search"
                className="w-full border-0 focus-visible:ring-transparent bg-transparent focus-visible:ring-offset-0 text-white placeholder:text-slate-300"
                placeholder="Enter Location"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-white hover:text-black transition-colors duration-300"
            >
              <SearchIcon
                className="h-5 w-5 md:h-6 md:w-6"
                aria-hidden="true"
              />
            </Button>
          </form>
          <Separator className="mt-2 rounded-full" />
        </CardHeader>

        <CardContent className="space-y-16">
          {/* Temperature Display */}
          <section className="flex justify-center items-center">
            <h2 className="text-6xl md:text-8xl text-white">
              {currentTemp.toFixed(1)}°{isCelsius ? "C" : "F"}
            </h2>
          </section>

          {/* Wind Speed Section */}
          <section className="flex justify-between items-end gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-white">Humidity</span>
              <h4 className="text-2xl md:text-4xl text-white flex flex-col">
                {weatherData?.currentConditions?.humidity}%
              </h4>
            </div>

            <p className="text-xs md:text-sm text-white">
              Wind:&nbsp;
              {weatherData?.currentConditions?.windspeed}&nbsp;mph
            </p>
          </section>

          {/* Temperature Indicator Section */}
          <section className="flex flex-col justify-between gap-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center relative">
                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-blue-300" />
                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-amber-200  -translate-x-2" />
                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-yellow-500 -translate-x-4" />
                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-orange-500 -translate-x-6" />
                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-red-500 -translate-x-8" />
              </div>
              <div className="flex items-center space-x-1">
                <div
                  className={`w-1 h-1 rounded-full ${getTemperatureColor(
                    currentTemp,
                    isCelsius
                  )}`}
                />
                <h5 className="text-xl md:text-2xl text-white">
                  {currentTemp.toFixed(1)}°{isCelsius ? "C" : "F"}
                </h5>
              </div>
            </div>

            {/* Risk Levels Section  */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2">
                <div>
                  <h6 className="text-sm text-white">Normal</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-blue-300" />
                      <span className="text-xs md:text-sm text-white">
                        27°C or below
                      </span>
                    </div>
                  </div>
                </div>
                <div className="place-self-end">
                  <h6 className="text-sm text-white">Caution</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-amber-200" />
                      <span className="text-xs md:text-sm text-white">
                        27°C&nbsp;-&nbsp;32°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <h6 className="text-sm text-white">Extreme Caution</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-yellow-500" />
                      <span className="text-xs md:text-sm text-white">
                        32°C&nbsp;-&nbsp;39°C
                      </span>
                    </div>
                  </div>
                </div>
                <div className="place-self-end">
                  <h6 className="text-sm text-white">Danger</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-orange-500" />
                      <span className="text-xs md:text-sm text-white">
                        39°C&nbsp;-&nbsp;51°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <h6 className="text-sm text-white">Extreme Danger</h6>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="text-xs md:text-sm text-white">
                        51°C or higher
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
            <h4 className="text-lg md:text-xl text-white">
              {weatherData?.resolvedAddress}
            </h4>
            <p className="text-xs md:text-sm mt-1 text-white">
              {weatherData?.days[0]?.description}
            </p>
          </section>
        </CardContent>
      </Card>
    </aside>
  );
};

export default React.memo(LeftAside);