"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";
import { DifficultyPieChart } from "@/components/quiz/DifficultyPieChart";
import { TopicBarChart } from "@/components/quiz/TopicBarChart";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const { state, currentTest, getResults } = useQuiz();
  const results = getResults();

  const handleBack = () => {
    router.back();
  };

  // Calculate topic scores
  const topicScores = currentTest.questions.reduce(
    (acc, question) => {
      const topic = question.topic;
      const userAnswer = state.answers[question.id];

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

  // Calculate difficulty scores
  const difficultyScores = currentTest.questions.reduce(
    (acc, question) => {
      const difficulty = question.difficulty;
      const userAnswer = state.answers[question.id];

      if (!acc[difficulty]) {
        acc[difficulty] = { totalMarks: 0, myScore: 0 };
      }

      acc[difficulty].totalMarks += 1;

      if (userAnswer === question.correctAnswer) {
        acc[difficulty].myScore += 1;
      }

      return acc;
    },
    {} as Record<string, { totalMarks: number; myScore: number }>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-inter font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Results
        </button>

        {/* Header */}
        <div>
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Detailed Analytics
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            {currentTest.title} · Latest Attempt
          </p>
        </div>

        {/* Section 1 - Time & Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12"
        >
          <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Time & Performance Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Large Time Display */}
            <div className="md:col-span-1 text-center">
              <div className="inline-block bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-2xl px-8 py-6 mb-4">
                <p className="font-inter text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                  Total Time Spent
                </p>
                <p className="font-fraunces text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.floor(results.timeSpent / 60)}m{" "}
                  {results.timeSpent % 60}s
                </p>
              </div>

              {/* Time Distribution */}
              <div className="space-y-2 text-left bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-sm font-inter">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Time on Correct Answers
                  </span>
                  <span className="font-bold">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Time on Incorrect Answers
                  </span>
                  <span className="font-bold">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Time on Skipped Questions
                  </span>
                  <span className="font-bold">88%</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="md:col-span-2">
              <div className="h-80">
                <TopicBarChart answers={state.answers} />
              </div>
            </div>
          </div>

          {/* Summary Sentence */}
          <p className="font-inter text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            You have scored{" "}
            <span className="font-bold text-green-600">
              {results.correct} marks
            </span>{" "}
            for correct answers, missed{" "}
            <span className="font-bold text-red-600">
              {results.incorrect} marks
            </span>{" "}
            on incorrect answers, lost{" "}
            <span className="font-bold">0 marks</span> due to negative marking
            and{" "}
            <span className="font-bold text-gray-600">
              {results.skipped} marks
            </span>{" "}
            by skipping questions.
          </p>
        </motion.div>

        {/* Section 2 - Topic Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white">
                Topic Report
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-inter mt-1">
                Topic Marks Distribution & Score Comparison
              </p>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 font-inter font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              View Report →
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-6 text-sm font-inter">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500"></span>
              <span className="text-gray-600 dark:text-gray-400">
                Total Marks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-violet-500"></span>
              <span className="text-gray-600 dark:text-gray-400">My Score</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-80 mb-6">
            <TopicBarChart answers={state.answers} />
          </div>
        </motion.div>

        {/* Section 3 - Difficulty Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white">
              Difficulty Level Analysis
            </h2>
            <button className="text-indigo-600 dark:text-indigo-400 font-inter font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              View Report →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div>
              <DifficultyPieChart timeSpent={results.timeSpent} />
            </div>

            {/* Score Analysis Table */}
            <div>
              <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white mb-4">
                Score In Difficulty Levels
              </h3>

              {/* Legend */}
              <div className="flex gap-4 mb-6 text-sm font-inter">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">Easy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Medium
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Intense
                  </span>
                </div>
              </div>

              {/* Scores Table */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="font-inter text-sm text-gray-600 dark:text-gray-400 font-semibold mb-4">
                  Total Marks: {currentTest.totalMarks}
                </div>

                {Object.entries(difficultyScores).map(([difficulty, scores]) => (
                  <div
                    key={difficulty}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          difficulty === "easy"
                            ? "bg-green-500"
                            : difficulty === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-gray-700 dark:text-gray-300 font-inter capitalize">
                        {difficulty}
                      </span>
                    </div>
                    <span className="font-inter font-bold text-gray-900 dark:text-white">
                      {scores.myScore} / {scores.totalMarks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Results Button */}
        <div className="text-center pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-inter font-bold transition-colors"
          >
            ← Back to Results
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
