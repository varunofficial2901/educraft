"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";

export default function InstructionsPage() {
  const router = useRouter();
  const { currentTest, startQuiz } = useQuiz();

  const handleStart = () => {
    startQuiz();
    if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    router.push(`/quiz/${currentTest.id}/take`);
  };

  const legendItems = [
    { color: "bg-gray-400", label: "Not Visited", dot: true },
    { color: "bg-red-500", label: "Not Answered", dot: true },
    { color: "bg-green-500", label: "Answered", dot: true },
    { color: "bg-violet-500", label: "Marked for Review", dot: true },
    { color: "bg-blue-500", label: "Answered & Marked", dot: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 flex items-center justify-center"
    >
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {currentTest.title}
          </h1>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-inter font-semibold">
              {currentTest.totalQuestions} Questions
            </span>
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-inter font-semibold">
              {currentTest.durationMinutes} Minutes
            </span>
          </div>
        </div>

        {/* General Instructions */}
        <div className="mb-8">
          <h2 className="font-fraunces text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
            General Instructions
          </h2>
          <ul className="space-y-3 font-inter text-gray-700 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
                1.
              </span>
              <span>
                Timer is set on server and displays a countdown. When it runs out, the exam ends automatically.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
                2.
              </span>
              <span>
                The question palette on the right shows the status of each question using colour codes.
              </span>
            </li>
          </ul>
        </div>

        {/* Colour Legend */}
        <div className="mb-8">
          <h2 className="font-fraunces text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
            Status Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex-shrink-0 ${item.color}`}></div>
                <span className="font-inter text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="font-fraunces text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
            Navigation
          </h2>
          <p className="font-inter text-gray-700 dark:text-gray-300 mb-3">
            • Click a question number in the palette to jump directly to it
          </p>
          <p className="font-inter text-gray-700 dark:text-gray-300">
            • Click Next/Prev to move sequentially through questions
          </p>
        </div>

        {/* Answering Questions */}
        <div className="mb-8">
          <h2 className="font-fraunces text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
            Answering Questions
          </h2>
          <ul className="space-y-2 font-inter text-gray-700 dark:text-gray-300">
            <li>• Click an option to select it</li>
            <li>• Click again or press Clear to deselect</li>
            <li>• Use Mark for Review to flag a question for later</li>
          </ul>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-bold py-4 px-6 rounded-2xl transition-colors text-lg"
        >
          START TEST →
        </motion.button>
      </div>
    </motion.div>
  );
}
