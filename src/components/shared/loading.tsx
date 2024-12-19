// Loading.tsx
import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <LoaderIcon className="h-5 w-5 md:h-6 md:w-6 text-white animate-spin" />
    </div>
  );
};

export default Loading;
