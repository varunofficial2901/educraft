"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/quiz/context/QuizContext";
import { CountdownTimer } from "@/components/quiz/CountdownTimer";
import { OptionButton } from "@/components/quiz/OptionButton";
import { QuestionPalette } from "@/components/quiz/QuestionPalette";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TakePage() {
  const router = useRouter();
  const {
    state,
    currentTest,
    selectAnswer,
    toggleMarkForReview,
    goToQuestion,
    submitQuiz,
    updateTime,
    clearAnswer,
  } = useQuiz();

  const [autoSubmit, setAutoSubmit] = useState(false);

  const current = currentTest.questions[state.currentQuestion];
  const selectedAnswer = state.answers[current?.id];
  const isMarked = state.markedForReview[current?.id] || false;

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.timeRemainingSeconds <= 0 && !autoSubmit) {
      setAutoSubmit(true);
      submitQuiz();
      setTimeout(() => {
        if (currentTest.type === "writing") {
          router.push(`/quiz/${currentTest.id}/results`);
        } else {
          router.push(`/quiz/${currentTest.id}/results`);
        }
      }, 500);
    }
  }, [state.timeRemainingSeconds, autoSubmit, submitQuiz, router, currentTest.id, currentTest.type]);

  const handleNext = () => {
    if (state.currentQuestion < currentTest.questions.length - 1) {
      goToQuestion(state.currentQuestion + 1);
    }
  };

  const scrollToPalette = () => {
    document.getElementById("question-palette")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePrev = () => {
    if (state.currentQuestion > 0) {
      goToQuestion(state.currentQuestion - 1);
    }
  };

  const getTopic = (question: typeof current) => {
    if (!question) return "";
    return question.topic.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Test Name */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <h1 className="font-fraunces text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {currentTest.title}
              </h1>
              <span className="hidden md:inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-inter font-semibold">
                {getTopic(current)}
              </span>
            </div>

            {/* Centre: Timer */}
            <div className="flex-shrink-0">
              <CountdownTimer
                initialSeconds={state.timeRemainingSeconds}
                onTimeUpdate={updateTime}
                onTimeUp={() => {
                  // Submission is handled by the page effect once the timer reaches zero.
                }}
              />
            </div>

            {/* Right: User Avatar Placeholder */}
            <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-inter font-bold text-lg">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Question Area */}
          <div className={currentTest.type === "writing" ? "lg:col-span-3" : "lg:col-span-2"}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
              {/* Question Header */}
              <div className="mb-6">
                <p className="text-indigo-600 dark:text-indigo-400 font-inter font-semibold mb-2">
                  Q. {state.currentQuestion + 1} of {currentTest.totalQuestions}
                </p>
                <h2 className="font-inter text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                  {current?.text}
                </h2>
                {currentTest.type !== "writing" && (
                  <button
                    type="button"
                    onClick={scrollToPalette}
                    className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-2 text-sm font-inter font-semibold text-[#3730A3] hover:bg-[#E0E7FF] transition-colors"
                  >
                    View All Questions
                  </button>
                )}
              </div>

              {/* Options / Textarea */}
              {currentTest.type === "writing" ? (
                <div className="mb-8 font-sans">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={selectedAnswer || ""}
                    onChange={(e) => selectAnswer(current.id, e.target.value)}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    className="w-full h-80 px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] font-sans text-base leading-relaxed resize-y shadow-inner"
                    placeholder="Type your essay or response here..."
                  />
                  <div className="flex justify-between items-center mt-3 text-xs font-semibold text-gray-400">
                    <span>Word Count: {((selectedAnswer || "").trim().split(/\s+/).filter(Boolean).length)}</span>
                    <span className="text-red-500/80">Copy, Paste, and Cut are disabled</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {current?.options.map((option, idx) => (
                    <OptionButton
                      key={option.id}
                      id={option.id}
                      text={option.text}
                      isSelected={selectedAnswer === option.id}
                      onClick={() => selectAnswer(current.id, option.id)}
                      index={idx}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Controls */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {currentTest.type !== "writing" ? (
                  <>
                    <button
                      onClick={() => toggleMarkForReview(current?.id)}
                      className={`px-6 py-3 rounded-xl font-inter font-semibold transition-colors ${
                        isMarked
                          ? "bg-violet-600 text-white hover:bg-violet-700"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {isMarked ? "✓ Marked" : "Mark for Review"}
                    </button>

                    <button
                      onClick={() => clearAnswer(current?.id)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-inter font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                      <button
                        onClick={handlePrev}
                        disabled={state.currentQuestion === 0}
                        className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <span className="text-sm font-inter font-semibold text-gray-700 dark:text-gray-300">
                        {state.currentQuestion + 1} / {currentTest.totalQuestions}
                      </span>

                      <button
                        onClick={handleNext}
                        disabled={state.currentQuestion === currentTest.totalQuestions - 1}
                        className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>

                      <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-inter font-semibold transition-colors"
                      >
                        NEXT →
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => clearAnswer(current?.id)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-inter font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => {
                        submitQuiz();
                        router.push(`/quiz/${currentTest.id}/results`);
                      }}
                      className="ml-auto px-6 py-3 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-inter font-semibold transition-colors"
                    >
                      SUBMIT TEST →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Question Palette (Only MCQ) */}
          {currentTest.type !== "writing" && (
            <div className="hidden lg:block" id="question-palette">
              <QuestionPalette
                currentQuestion={state.currentQuestion}
                statuses={state.statuses}
                onQuestionSelect={goToQuestion}
                onSubmit={() => {
                  submitQuiz();
                  router.push(`/quiz/${currentTest.id}/submit`);
                }}
              />
            </div>
          )}
        </div>

        {currentTest.type !== "writing" && (
          <>
            {/* Mobile Question Palette */}
            <div className="lg:hidden mt-8" id="question-palette">
              <QuestionPalette
                currentQuestion={state.currentQuestion}
                statuses={state.statuses}
                onQuestionSelect={goToQuestion}
                onSubmit={() => {
                  submitQuiz();
                  router.push(`/quiz/${currentTest.id}/results`);
                }}
              />
            </div>

            {/* Mobile Submit Button */}
            <div className="lg:hidden mt-8 text-center">
              <button
                onClick={() => {
                  submitQuiz();
                  router.push(`/quiz/${currentTest.id}/results`);
                }}
                className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-inter font-bold text-lg transition-colors"
              >
                ✓ SUBMIT TEST
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
