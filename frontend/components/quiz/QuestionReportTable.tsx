"use client";

import { mockTest } from "@/app/quiz/data/mockTest";

interface QuestionReportTableProps {
  answers: Record<number, string>;
}

export function QuestionReportTable({ answers }: QuestionReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
      <table className="w-full font-inter text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Q No.
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Topic
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Your Answer
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Correct Answer
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {mockTest.questions.map((question, idx) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const isSkipped = userAnswer === undefined;

            return (
              <tr
                key={question.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {question.id}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {question.topic}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {userAnswer ? `${userAnswer}.` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {question.correctAnswer}.
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isSkipped ? (
                      <>
                        <span className="text-gray-500">—</span>
                        <span className="text-gray-500">Skipped</span>
                      </>
                    ) : isCorrect ? (
                      <>
                        <span className="text-green-600 dark:text-green-400">✅</span>
                        <span className="text-green-600 dark:text-green-400">Correct</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-600 dark:text-red-400">❌</span>
                        <span className="text-red-600 dark:text-red-400">Wrong</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
