"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";
import { StatCircle } from "@/components/quiz/StatCircle";
import { QuestionReportTable } from "@/components/quiz/QuestionReportTable";
import { ChevronRight } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const { state, currentTest, getResults } = useQuiz();
  const results = getResults();

  const handleViewAnalytics = () => {
    router.push(`/quiz/${currentTest.id}/analytics`);
  };

  // Calculate marks breakdown
  const totalSkippedMarks = results.skipped;
  const totalIncorrectMarks = results.incorrect;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Section - Score Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {currentTest.title}
              </h1>
              <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-inter font-semibold">
                Latest Attempt
              </span>
            </div>

            {/* Score and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Left Box - Your Score */}
              <div className="md:col-span-1">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-2xl p-6 text-center">
                  <p className="font-inter text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                    Your Score
                  </p>
                  <p className="font-fraunces text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                    {results.score}
                  </p>
                  <p className="font-inter text-gray-600 dark:text-gray-400 mb-4">
                    out of {currentTest.totalMarks}
                  </p>
                  <hr className="border-indigo-200 dark:border-indigo-800 my-4" />
                  <div className="space-y-2 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Percentile
                      </span>
                      <span className="font-inter font-bold text-indigo-600 dark:text-indigo-400">
                        {results.percentile}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Accuracy
                      </span>
                      <span className="font-inter font-bold text-indigo-600 dark:text-indigo-400">
                        {results.accuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Percentage
                      </span>
                      <span className="font-inter font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.round((results.score / currentTest.totalMarks) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-inter font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  VIEW SOLUTION
                </motion.button>
              </div>

              {/* Right - Stat Circles */}
              <div className="md:col-span-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <StatCircle
                    number={results.correct}
                    label="Correct"
                    color="green"
                  />
                  <StatCircle
                    number={results.incorrect}
                    label="Incorrect"
                    color="red"
                  />
                  <StatCircle number={0} label="Negative Marking" color="gray" />
                  <StatCircle
                    number={results.skipped}
                    label="Skipped"
                    color="dark"
                  />
                </div>

                {/* Summary Sentence */}
                <p className="font-inter text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  You have scored{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {results.correct} marks
                  </span>{" "}
                  for correct answers, missed{" "}
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {results.incorrect} marks
                  </span>{" "}
                  on incorrect answers, lost{" "}
                  <span className="font-bold">0 marks</span> due to negative
                  marking and{" "}
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    {totalSkippedMarks} marks
                  </span>{" "}
                  by skipping questions.
                </p>
              </div>
            </div>

            {/* View Analytics Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewAnalytics}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              View Detailed Analytics <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Section - Question Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-3xl font-bold text-gray-900 dark:text-white">
              Question Report
            </h2>
            <motion.button
              onClick={handleViewAnalytics}
              className="text-indigo-600 dark:text-indigo-400 font-inter font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2 transition-colors"
            >
              View Report <ChevronRight size={18} />
            </motion.button>
          </div>

          <QuestionReportTable answers={state.answers} />
        </motion.div>
      </div>
    </motion.div>
  );
}
