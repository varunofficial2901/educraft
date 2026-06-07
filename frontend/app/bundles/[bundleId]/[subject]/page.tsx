"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Brain, BookOpen, PenTool, Play, CheckCircle, Lock } from "lucide-react";
import { mathAssessment, mockTest, writingAssessment } from "@/app/quiz/data/mockTest";

const BUNDLE_NAMES: Record<string, string> = {
  foundation: "Foundation Bundle",
  advance: "Advance Bundle",
  mastery: "Mastery Bundle"
};

const BUNDLE_TEST_COUNTS: Record<string, number> = {
  foundation: 10,
  advance: 20,
  mastery: 40
};

const SUBJECT_METADATA: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  mathematics: { name: "Mathematics", icon: Calculator, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]" },
  reasoning: { name: "Reasoning", icon: Brain, color: "text-[#6366F1]", bg: "bg-[#EEF2FF]" },
  "reading-skills": { name: "Reading Skills", icon: BookOpen, color: "text-[#EA580C]", bg: "bg-[#FFF7ED]" },
  "writing-skills": { name: "Writing Skills", icon: PenTool, color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" }
};

export default function SubjectTestsPage({ params }: { params: any }) {
  const resolvedParams = use<{ bundleId: string; subject: string }>(params);
  const bundleId = resolvedParams.bundleId;
  const subjectSlug = resolvedParams.subject;

  const bundleName = BUNDLE_NAMES[bundleId];
  const subjectMeta = SUBJECT_METADATA[subjectSlug];
  const testCount = BUNDLE_TEST_COUNTS[bundleId];

  const [isPurchased, setIsPurchased] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("edu_purchased_bundles");
      let list = [];
      try {
        list = stored ? JSON.parse(stored) : [];
      } catch (e) {}
      const purchased = list.some((item: any) => item.id === `${bundleId}-bundle`);
      setIsPurchased(purchased);
    }
  }, [bundleId]);

  const handleStartTestClick = (e: React.MouseEvent) => {
    if (!isPurchased) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  // Validate parameters
  if (!bundleName || !subjectMeta || !testCount) {
    return (
      <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The tests page you are looking for does not exist.</p>
        <Link href="/courses" className="px-6 py-3 bg-[#6366F1] text-white rounded-xl font-semibold">
          Back to Test Series
        </Link>
      </div>
    );
  }

  // Determine quiz link for testing
  let testLink = "";
  let duration = "45 Minutes";
  let marks = "40 Marks";
  let active = true;

  if (subjectSlug === "mathematics") {
    testLink = `/quiz/${mathAssessment.id}/instructions`;
    duration = "60 Minutes";
  } else if (subjectSlug === "reasoning") {
    testLink = `/quiz/${mockTest.id}/instructions`;
    duration = "60 Minutes";
  } else if (subjectSlug === "writing-skills") {
    testLink = `/quiz/${writingAssessment.id}/instructions`;
    duration = "30 Minutes";
    marks = "20 Marks";
  } else {
    // Reading is Coming Soon
    active = false;
  }

  const SubjectIcon = subjectMeta.icon;

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl font-sans">
        
        {/* Back Link */}
        <Link href={`/bundles/${bundleId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:underline mb-6">
          <ArrowLeft size={16} /> Back to {bundleName} Details
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-8 mb-10 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 text-left">
              <div className={`w-14 h-14 rounded-2xl ${subjectMeta.bg} flex items-center justify-center ${subjectMeta.color} shrink-0`}>
                <SubjectIcon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">{bundleName}</p>
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mt-1">
                  {subjectMeta.name} Tests
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Total of {testCount} curriculum-aligned test papers available.
                </p>
              </div>
            </div>

            <div className="shrink-0 font-semibold text-sm bg-indigo-50 dark:bg-slate-900 text-[#6366F1] px-4 py-2 rounded-2xl">
              {testCount} Papers Available
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-[#EEF2FF] dark:bg-slate-950 border border-[#CBD5E1] dark:border-slate-700 p-5 text-sm text-slate-700 dark:text-slate-200">
            <p className="font-semibold mb-2">Curriculum Note</p>
            <p>
              These tests are strongly aligned with the NSW curriculum and designed to support structured practice for selective exam preparation and academic growth.
            </p>
          </div>
        </div>

        {/* Vertical Cards Stack Layout */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {Array.from({ length: testCount }).map((_, idx) => {
            const paperNumber = idx + 1;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left transition-colors hover:border-indigo-100"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 mt-0.5">
                    {paperNumber}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                      {subjectMeta.name} Test Paper {paperNumber}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                      <span>Duration: {duration}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>Marks: {marks}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[#16A34A] font-semibold flex items-center gap-0.5">
                        <CheckCircle size={12} /> Ready to start
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  {active ? (
                    <Link
                      href={testLink}
                      onClick={handleStartTestClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                      Start Test <Play size={14} fill="white" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-semibold cursor-not-allowed border border-slate-200"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-modalIn">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-[#6366F1] rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock size={32} />
            </div>
            
            <h3 className="font-serif font-bold text-2xl text-[#0F172A] dark:text-white mb-2">
              Unlock Paid Assessment
            </h3>
            <p className="text-[#334155] dark:text-gray-300 text-sm mb-6 leading-relaxed font-sans">
              To open this test paper, please purchase the <span className="font-bold text-[#6366F1]">{bundleName}</span>.
            </p>

            <div className="flex flex-col gap-3 font-sans">
              <Link
                href={`/bundles/${bundleId}`}
                className="w-full py-3 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-2xl text-sm font-semibold transition-colors shadow-sm inline-block"
              >
                Go to Purchase Details
              </Link>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 text-[#334155] dark:text-white rounded-2xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-modalIn {
              animation: modalIn 0.25s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
