import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate logo loading and animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-primary">
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-700 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="relative">
          <img
            src={logo}
            alt="List Word in Day Logo"
            className="w-32 h-32 animate-pulse-glow"
          />
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground animate-fade-in">
          List Word in Day
        </h1>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
