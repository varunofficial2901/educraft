"use client";

import { mockTest } from "@/app/quiz/data/mockTest";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TopicBarChartProps {
  answers: Record<number, string>;
}

export function TopicBarChart({ answers }: TopicBarChartProps) {
  // Calculate topic scores
  const topicScores = mockTest.questions.reduce(
    (acc, question) => {
      const topic = question.topic;
      const userAnswer = answers[question.id];

      if (!acc[topic]) {
        acc[topic] = { totalMarks: 0, myScore: 0 };
      }

      acc[topic].totalMarks += 1;

      if (userAnswer === question.correctAnswer) {
        acc[topic].myScore += 1;
      }

      return acc;
    },
    {} as Record<string, { totalMarks: number; myScore: number }>
  );

  const data = Object.entries(topicScores).map(([topic, scores]) => ({
    name: topic,
    "Total Marks": scores.totalMarks,
    "My Score": scores.myScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Total Marks" fill="#3b82f6" />
        <Bar dataKey="My Score" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
