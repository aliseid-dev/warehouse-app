import { useEffect } from "react";
import "../styles/SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Hide splash after 3s
    }, 300000); // Adjust duration to match your GIF

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src="/lit.gif" alt="Loading..." className="splash-gif" />
        <h1 className="app-name">Flash stock</h1> {/* Replace with your app name */}
      </div>
    </div>
  );
}