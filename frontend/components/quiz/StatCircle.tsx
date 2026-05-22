"use client";

interface StatCircleProps {
  number: number;
  label: string;
  color: "green" | "red" | "gray" | "dark";
}

const colorClasses = {
  green: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  red: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  dark: "bg-gray-900 dark:bg-gray-700 text-gray-100",
};

export function StatCircle({
  number,
  label,
  color,
}: StatCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center ${colorClasses[color]}`}
      >
        <span className="font-fraunces text-3xl font-bold">{number}</span>
      </div>
      <p className="text-sm font-inter font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </p>
    </div>
  );
}
