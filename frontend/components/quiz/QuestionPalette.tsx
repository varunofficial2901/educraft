"use client";

import { QuestionStatus } from "@/app/quiz/context/QuizContext";
import { mockTest } from "@/app/quiz/data/mockTest";
import { motion } from "framer-motion";

interface QuestionPaletteProps {
  currentQuestion: number;
  statuses: Record<number, QuestionStatus>;
  onQuestionSelect: (index: number) => void;
  onSubmit: () => void;
}

export function QuestionPalette({
  currentQuestion,
  statuses,
  onQuestionSelect,
  onSubmit,
}: QuestionPaletteProps) {
  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case "not-visited":
        return "bg-gray-400";
      case "unanswered":
        return "bg-red-500";
      case "answered":
        return "bg-green-500";
      case "marked":
        return "bg-violet-500";
      case "answered-marked":
        return "bg-blue-500";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm h-fit sticky top-6">
      {/* Question Grid */}
      <div>
        <h3 className="font-fraunces text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Question Palette
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {mockTest.questions.map((q, idx) => {
            const status = statuses[q.id] || "not-visited";
            const isActive = idx === currentQuestion;

            return (
              <motion.button
                key={q.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuestionSelect(idx)}
                className={`w-10 h-10 rounded-full text-sm font-inter font-bold transition-all ${
                  isActive
                    ? `${getStatusColor(status)} ring-2 ring-offset-2 ring-indigo-600 text-white`
                    : `${getStatusColor(status)} text-white hover:opacity-90`
                }`}
              >
                {q.id}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Colour Legend */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="font-inter text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Legend:
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="text-gray-600 dark:text-gray-400">Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Unanswered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-violet-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Marked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Ans. & Marked</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col gap-2">
        <button
          onClick={() => onQuestionSelect(0)}
          className="w-full px-4 py-2 text-sm font-inter font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition-colors"
        >
          ↺ All Questions
        </button>
        <button
          onClick={onSubmit}
          className="w-full px-4 py-2 text-sm font-inter font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors"
        >
          ✓ SUBMIT
        </button>
      </div>
    </div>
  );
}
