"use client";

import { useParams } from "next/navigation";
import { QuizProvider } from "./context/QuizContext";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const testId = Array.isArray(params?.testId)
    ? params.testId[0] ?? "reasoning-assessment-1"
    : params?.testId ?? "reasoning-assessment-1";

  return <QuizProvider testId={testId}>{children}</QuizProvider>;
}
