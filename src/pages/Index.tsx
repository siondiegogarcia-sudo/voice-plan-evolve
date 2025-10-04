import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Auth from "@/pages/Auth";
import Calendar from "@/pages/Calendar";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // TODO: Check authentication status with Lovable Cloud
    // For now, simulate checking auth state
    const checkAuth = () => {
      const authStatus = false; // This will be replaced with actual auth check
      setIsAuthenticated(authStatus);
    };

    if (!showSplash) {
      checkAuth();
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <Calendar />;
};

export default Index;
