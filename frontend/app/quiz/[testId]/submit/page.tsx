"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";
import { ArrowLeft } from "lucide-react";

export default function SubmitPage() {
  const router = useRouter();
  const { state, currentTest } = useQuiz();

  const answered = Object.keys(state.answers).length;
  const skipped = currentTest.totalQuestions - answered;
  const marked = Object.values(state.markedForReview).filter(Boolean).length;

  const handleSubmit = () => {
    router.push(`/quiz/${currentTest.id}/results`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-inter font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Test
        </button>

        {/* Title */}
        <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          Submit Quiz
        </h1>

        {/* Subtitle */}
        <p className="font-inter text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Before you submit the test, please make sure you have attended all the
          questions.
        </p>

        {/* Stats List */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <span className="font-inter text-gray-700 dark:text-gray-300">
              Total Questions
            </span>
            <span className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white">
              {currentTest.totalQuestions}
            </span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span className="font-inter text-gray-700 dark:text-gray-300">
                Answered
              </span>
            </div>
            <span className="font-fraunces text-2xl font-bold text-green-600 dark:text-green-400">
              {answered}
            </span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500"></span>
              <span className="font-inter text-gray-700 dark:text-gray-300">
                Skipped / Unattempted
              </span>
            </div>
            <span className="font-fraunces text-2xl font-bold text-red-600 dark:text-red-400">
              {skipped}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-violet-500"></span>
              <span className="font-inter text-gray-700 dark:text-gray-300">
                Marked for Review
              </span>
            </div>
            <span className="font-fraunces text-2xl font-bold text-violet-600 dark:text-violet-400">
              {marked}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-inter font-bold py-4 px-6 rounded-2xl transition-colors text-lg mb-4"
        >
          ✓ SUBMIT
        </motion.button>

        {/* Back to Test Link */}
        <button
          onClick={handleBack}
          className="w-full text-center text-indigo-600 dark:text-indigo-400 font-inter font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          ← BACK TO TEST
        </button>
      </div>
    </motion.div>
  );
}
