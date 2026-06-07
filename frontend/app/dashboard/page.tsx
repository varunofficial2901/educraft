"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Calculator, Brain, PenTool, CheckCircle2, Play, Calendar, User, Award } from "lucide-react";

interface PurchasedBundle {
  id: string;
  title: string;
  subtitle: string;
  price: number;
}

interface RecentAssessment {
  testId: string;
  testTitle: string;
  bundleName?: string;
  date: string;
  score: string | number;
  totalMarks: number;
  type: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [purchased, setPurchased] = useState<PurchasedBundle[]>([]);
  const [recent, setRecent] = useState<RecentAssessment[]>([]);
  const [writingStatus, setWritingStatus] = useState<string>("Not Started");
  const [hasWritingProgress, setHasWritingProgress] = useState<boolean>(false);

  useEffect(() => {
    // User details
    const savedUser = localStorage.getItem("edu_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // Purchased bundles
    const storedBundles = localStorage.getItem("edu_purchased_bundles");
    if (storedBundles) {
      try {
        setPurchased(JSON.parse(storedBundles));
      } catch (e) {}
    }

    // Recent assessments
    const storedRecent = localStorage.getItem("edu_recent_assessments");
    if (storedRecent) {
      try {
        setRecent(JSON.parse(storedRecent));
      } catch (e) {}
    }

    // Writing Status
    const storedWritingStatus = localStorage.getItem("edu_writing_status") || "Not Started";
    setWritingStatus(storedWritingStatus);

    // Writing progress check
    const writingProgress = localStorage.getItem("edu_quiz_progress_writing-assessment-1");
    if (writingProgress) {
      setHasWritingProgress(true);
    }
  }, []);

  const handleStartWriting = () => {
    router.push("/quiz/writing-assessment-1/instructions");
  };

  const getSubjectIcon = (title: string) => {
    if (title.toLowerCase().includes("math")) return Calculator;
    if (title.toLowerCase().includes("reason")) return Brain;
    if (title.toLowerCase().includes("read")) return BookOpen;
    return PenTool;
  };

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Profile Summary Header */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
              <User size={32} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider">Welcome Back</p>
              <h1 className="text-3xl font-serif font-bold text-[#0F172A] mt-1">
                {user ? `${user.first_name} ${user.last_name}` : "Student"}
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">{user?.email || "Study Dashboard"}</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Link
              href="/courses"
              className="flex-1 md:flex-initial inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#6366F1] text-white font-sans font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
            >
              Browse Test Series
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns - Bundles and Recent Assessments */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section: Purchased Bundles */}
            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#16A34A] rounded-full inline-block"></span>
                Purchased Bundles
              </h2>

              {purchased.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#CBD5E1] rounded-2xl p-6">
                  <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-1">No bundles purchased yet</h3>
                  <p className="text-sm text-[#64748B] mb-5">Buy a preparation bundle from our courses page to get started.</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#6366F1]/10 text-[#6366F1] font-semibold text-sm hover:bg-[#6366F1]/20 transition-colors"
                  >
                    View Bundles
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchased.map((bundle) => (
                    <div
                      key={bundle.id}
                      className="border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC] flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-md">
                          Active Bundle
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[#0F172A] mt-3 mb-1">
                          {bundle.title}
                        </h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {bundle.subtitle}
                        </p>
                      </div>

                      <div className="border-t border-[#E2E8F0] mt-4 pt-4 flex items-center justify-between">
                        <span className="text-xs text-[#64748B] font-medium">Full Access</span>
                        <Link
                          href="/courses"
                          className="inline-flex items-center gap-1.5 text-[#6366F1] hover:text-indigo-700 font-semibold text-sm transition-colors"
                        >
                          Practice Tests <Play size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Recent Assessments */}
            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#6366F1] rounded-full inline-block"></span>
                Recent Assessments
              </h2>

              {recent.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#CBD5E1] rounded-2xl p-6">
                  <Award size={40} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-1">No assessments taken yet</h3>
                  <p className="text-sm text-[#64748B]">Your recent test attempts and scores will be recorded here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recent.map((attempt, index) => {
                    const Icon = getSubjectIcon(attempt.testTitle);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            <Icon size={20} />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#0F172A] line-clamp-1">
                              {attempt.testTitle} {attempt.bundleName ? `(from ${attempt.bundleName})` : ""}
                            </h4>
                            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                              <Calendar size={12} /> {attempt.date}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-[#64748B] font-medium">Score</p>
                          <p className={`text-base font-bold mt-0.5 ${attempt.score === "Pending" ? "text-yellow-600" : "text-[#16A34A]"}`}>
                            {attempt.score === "Pending" ? "Pending" : `${attempt.score}/${attempt.totalMarks}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Writing Skills Status */}
          <div>
            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#8B5CF6] rounded-full inline-block"></span>
                Writing Skills Status
              </h2>

              <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-gradient-to-b from-white to-[#F9FAFB] text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-4">
                  <PenTool size={28} />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-1">
                  Writing Assessment
                </h3>
                <p className="text-xs text-[#64748B] mb-5">
                  Year 6 Creative Writing Paper
                </p>

                {/* Status Badges */}
                <div className="mb-6 w-full">
                  {writingStatus === "Not Started" && (
                    <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Status: Not Started
                    </div>
                  )}
                  {writingStatus === "Pending Review" && (
                    <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Status: Pending Review
                    </div>
                  )}
                  {writingStatus === "Reviewed" && (
                    <div className="inline-block px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Status: Reviewed
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-[#E2E8F0] pt-6 flex flex-col gap-3">
                  {writingStatus === "Not Started" ? (
                    <button
                      onClick={handleStartWriting}
                      className="w-full bg-[#6366F1] hover:bg-indigo-600 text-white font-sans font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
                    >
                      {hasWritingProgress ? "Resume Writing Test" : "Start Writing Test"}
                    </button>
                  ) : writingStatus === "Pending Review" ? (
                    <p className="text-xs text-[#64748B] leading-relaxed italic">
                      Your submission has been received and is currently under evaluation by our examiners.
                    </p>
                  ) : (
                    <p className="text-xs text-[#16A34A] leading-relaxed font-semibold">
                      Your submission is reviewed! Tutors' feedback is now available on your profile.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
