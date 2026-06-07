"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

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
  const hasTimeUpCalled = useRef(false);

  useEffect(() => {
    setSeconds(initialSeconds);
    hasTimeUpCalled.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  useEffect(() => {
    if (seconds <= 0) {
      if (!hasTimeUpCalled.current) {
        hasTimeUpCalled.current = true;
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLowTime = seconds < 300; // Red when under 5 minutes

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-[#eff6ff] dark:bg-[#1e293b] px-4 py-3 shadow-sm border border-[#c7d2fe] dark:border-[#334155]">
      <Clock className={`w-5 h-5 ${isLowTime ? "text-red-500" : "text-indigo-600"}`} />
      <span className={`text-lg font-inter font-bold ${isLowTime ? "text-red-500" : "text-indigo-600"}`}>
        {minutes}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
