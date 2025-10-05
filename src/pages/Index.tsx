import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Calendar from "@/pages/Calendar";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <Calendar />;
};

export default Index;
