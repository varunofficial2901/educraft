"use client";

import { mockTest } from "@/app/quiz/data/mockTest";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DifficultyPieChartProps {
  timeSpent: number;
}

export function DifficultyPieChart({ timeSpent }: DifficultyPieChartProps) {
  // Calculate difficulty distribution
  const difficultyCount = { easy: 0, medium: 0, intense: 0 };

  mockTest.questions.forEach((q) => {
    difficultyCount[q.difficulty as keyof typeof difficultyCount]++;
  });

  const data = [
    { name: "Easy", value: difficultyCount.easy },
    { name: "Medium", value: difficultyCount.medium },
    { name: "Intense", value: difficultyCount.intense },
  ];

  const colors = ["#dcfce7", "#fed7aa", "#fecaca"];

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
          Total Time Spent
        </p>
        <p className="font-fraunces text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {minutes}m {seconds}s
        </p>
      </div>
    </div>
  );
}
