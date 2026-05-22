"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getQuizTest, QuizTest } from "../data/mockTest";

export type QuestionStatus = "not-visited" | "unanswered" | "answered" | "marked" | "answered-marked";

export type QuizResults = {
  correct: number;
  incorrect: number;
  skipped: number;
  score: number;
  percentile: number;
  accuracy: number;
  timeSpent: number; // in seconds
};

interface QuizState {
  answers: Record<number, string>;
  statuses: Record<number, QuestionStatus>;
  markedForReview: Record<number, boolean>;
  currentQuestion: number;
  startedAt: Date | null;
  submittedAt: Date | null;
  timeRemainingSeconds: number;
}

interface QuizContextValue {
  state: QuizState;
  currentTest: QuizTest;
  startQuiz: () => void;
  selectAnswer: (questionId: number, optionId: string) => void;
  toggleMarkForReview: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => void;
  getResults: () => QuizResults;
  updateTime: (seconds: number) => void;
  clearAnswer: (questionId: number) => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children, testId }: { children: React.ReactNode; testId: string }) {
  const currentTest = useMemo(() => getQuizTest(testId), [testId]);

  const [state, setState] = useState<QuizState>({
    answers: {},
    statuses: {},
    markedForReview: {},
    currentQuestion: 0,
    startedAt: null,
    submittedAt: null,
    timeRemainingSeconds: currentTest.durationMinutes * 60,
  });

  const startQuiz = useCallback(() => {
    setState((prev) => {
      const initialStatuses: Record<number, QuestionStatus> = {};
      currentTest.questions.forEach((q) => {
        initialStatuses[q.id] = "not-visited";
      });
      return {
        ...prev,
        startedAt: new Date(),
        statuses: initialStatuses,
      };
    });
  }, [currentTest]);

  const selectAnswer = useCallback((questionId: number, optionId: string) => {
    setState((prev) => {
      const isMarked = prev.markedForReview[questionId] || false;
      const newStatus: QuestionStatus = isMarked ? "answered-marked" : "answered";

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: optionId,
        },
        statuses: {
          ...prev.statuses,
          [questionId]: newStatus,
        },
      };
    });
  }, []);

  const toggleMarkForReview = useCallback((questionId: number) => {
    setState((prev) => {
      const isCurrentlyMarked = prev.markedForReview[questionId] || false;
      const hasAnswer = prev.answers[questionId] !== undefined;

      let newStatus: QuestionStatus;
      if (!isCurrentlyMarked) {
        newStatus = hasAnswer ? "answered-marked" : "marked";
      } else {
        newStatus = hasAnswer ? "answered" : "unanswered";
      }

      return {
        ...prev,
        markedForReview: {
          ...prev.markedForReview,
          [questionId]: !isCurrentlyMarked,
        },
        statuses: {
          ...prev.statuses,
          [questionId]: newStatus,
        },
      };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < currentTest.questions.length) {
      setState((prev) => {
        const question = currentTest.questions[index];
        const currentStatus = prev.statuses[question.id] || "not-visited";

        // Update status to unanswered if not-visited and we're viewing it
        const newStatus =
          currentStatus === "not-visited" ? "unanswered" : currentStatus;

        return {
          ...prev,
          currentQuestion: index,
          statuses: {
            ...prev.statuses,
            [question.id]: newStatus,
          },
        };
      });
    }
  }, [currentTest.questions.length, currentTest.questions]);

  const clearAnswer = useCallback((questionId: number) => {
    setState((prev) => {
      const isMarked = prev.markedForReview[questionId] || false;
      const newStatus: QuestionStatus = isMarked ? "marked" : "unanswered";

      const newAnswers = { ...prev.answers };
      delete newAnswers[questionId];

      return {
        ...prev,
        answers: newAnswers,
        statuses: {
          ...prev.statuses,
          [questionId]: newStatus,
        },
      };
    });
  }, []);

  const submitQuiz = useCallback(() => {
    setState((prev) => ({
      ...prev,
      submittedAt: new Date(),
    }));
  }, []);

  const updateTime = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      timeRemainingSeconds: Math.max(0, seconds),
    }));
  }, []);

  const getResults = useCallback((): QuizResults => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    currentTest.questions.forEach((question) => {
      const userAnswer = state.answers[question.id];
      if (userAnswer === undefined) {
        skipped++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = correct;
    const accuracy = Math.round((correct / currentTest.totalQuestions) * 100);
    const percentile = Math.floor(Math.random() * 30 + 65); // Mock: 65-95%
    const timeSpent = state.startedAt
      ? Math.round(
          (new Date().getTime() - state.startedAt.getTime()) / 1000
        )
      : 0;

    return {
      correct,
      incorrect,
      skipped,
      score,
      percentile,
      accuracy,
      timeSpent,
    };
  }, [state.answers, state.startedAt, currentTest]);

  const value: QuizContextValue = useMemo(
    () => ({
      state,
      currentTest,
      startQuiz,
      selectAnswer,
      toggleMarkForReview,
      goToQuestion,
      submitQuiz,
      getResults,
      updateTime,
      clearAnswer,
    }),
    [state, currentTest, startQuiz, selectAnswer, toggleMarkForReview, goToQuestion, submitQuiz, getResults, updateTime, clearAnswer]
  );

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}
