"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  onTimeUpdate: (seconds: number) => void;
}

export function CountdownTimer({
  initialSeconds,
  onTimeUp,
  onTimeUpdate,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev - 1;
        onTimeUpdate(newSeconds);
        if (newSeconds <= 0) {
          onTimeUp();
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp, onTimeUpdate]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLowTime = seconds < 300; // Red when under 5 minutes

  return (
    <div
      className={`text-2xl font-inter font-bold ${
        isLowTime ? "text-red-500" : "text-indigo-600"
      }`}
    >
      {minutes}:{secs.toString().padStart(2, "0")}
    </div>
  );
}
