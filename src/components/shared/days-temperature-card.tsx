import { Card } from "@/components/ui/card";

interface LocationTempProps {
  temperature: number;
  location: string;
  tempMin: number;
  tempMax: number;
  isCelsius: boolean;
}

export const DaysTemperatureCard: React.FC<LocationTempProps> = ({
  temperature,
  location,
  tempMin,
  tempMax,
  isCelsius,
}) => {
  const getTemperatureWidth = (temp: number, isCelsius: boolean) => {
    const minPossible = isCelsius ? -20 : -4;
    const maxPossible = isCelsius ? 50 : 122;
    const range = maxPossible - minPossible;
    const percentage = ((temp - minPossible) / range) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

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

  return (
    <Card className="p-2 xl:p-4">
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-2xl 2xl:text-4xl">
          {temperature}°{isCelsius ? "C" : "F"}
        </h3>
        <p className="text-xs md:text-sm">{location}</p>
        <div className="w-full space-y-1">
          {/* High temp */}
          <div className="h-1 overflow-hidden bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${getTemperatureColor(
                tempMax,
                isCelsius
              )}`}
              style={{ width: `${getTemperatureWidth(tempMax, isCelsius)}%` }}
            />
          </div>
          {/* Low temp */}
          <div className="h-1 overflow-hidden bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${getTemperatureColor(
                tempMin,
                isCelsius
              )}`}
              style={{ width: `${getTemperatureWidth(tempMin, isCelsius)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};