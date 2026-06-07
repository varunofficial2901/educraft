"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";
import { StatCircle } from "@/components/quiz/StatCircle";
import { QuestionReportTable } from "@/components/quiz/QuestionReportTable";
import { ChevronRight } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const { state, currentTest, getResults } = useQuiz();
  const results = getResults();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentTest.type === "writing") {
        localStorage.setItem("edu_writing_status", "Pending Review");
      }
      
      const scoreValue = currentTest.type === "writing" ? "Pending" : results.score;
      const recent = localStorage.getItem("edu_recent_assessments");
      let list = [];
      try {
        list = recent ? JSON.parse(recent) : [];
      } catch (e) {
        list = [];
      }

      // Avoid duplicate logs
      const alreadyExists = list.some(
        (item: any) => item.testId === currentTest.id && item.score === scoreValue
      );
      
      if (!alreadyExists) {
        list.unshift({
          testId: currentTest.id,
          testTitle: currentTest.title,
          bundleName: currentTest.bundle,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          score: scoreValue,
          totalMarks: currentTest.totalMarks,
          type: currentTest.type || "mcq",
        });
        localStorage.setItem("edu_recent_assessments", JSON.stringify(list.slice(0, 10)));
      }
    }
  }, [currentTest.id, currentTest.title, currentTest.totalMarks, currentTest.type, results.score]);

  const handleViewAnalytics = () => {
    router.push(`/quiz/${currentTest.id}/analytics`);
  };

  // Calculate marks breakdown
  const totalSkippedMarks = results.skipped;

  // Custom UI for Writing Test Type
  if (currentTest.type === "writing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Submission Received
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-sans text-base leading-relaxed mb-8">
            Your response has been sent for review. Once reviewed, your result will be shared at your registered email address.
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400 font-semibold mb-2">
                Status
              </p>
              <div className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold">
                Pending Review
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Result Delivery</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Result will be sent to your registered email.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Notification</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">You will be notified once the review is completed.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[#6366F1] hover:bg-indigo-600 text-white font-inter font-bold py-4 px-6 rounded-2xl transition-colors text-lg"
          >
            Go To My Dashboard
          </button>
        </div>
      </div>
    );
  }

  // MCQ standard layout without motion
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Section - Score Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
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

                <button className="w-full mt-4 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-inter font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  VIEW SOLUTION
                </button>
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
            <button
              onClick={handleViewAnalytics}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-bold py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              View Detailed Analytics <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Section - Question Report */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-3xl font-bold text-gray-900 dark:text-white">
              Question Report
            </h2>
            <button
              onClick={handleViewAnalytics}
              className="text-indigo-600 dark:text-indigo-400 font-inter font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2 transition-colors"
            >
              View Report <ChevronRight size={18} />
            </button>
          </div>

          <QuestionReportTable answers={state.answers} />
        </div>
      </div>
    </div>
  );
}
