import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Loading = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      {showLoader && (
        <LoaderIcon className="w-5 h-5 text-white md:h-6 md:w-6 animate-spin" />
      )}
    </div>
  );
};

export default Loading;
