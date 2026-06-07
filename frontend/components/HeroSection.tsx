"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById('courses');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Image Placeholder (40-45%) */}
          <div className="w-full md:w-[45%] h-[400px] md:h-[550px] relative rounded-3xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 flex flex-col items-center justify-center text-[#64748B] text-center p-6 gap-3 select-none">
            {/* <span className="text-6xl">📚</span> */}
            <div>
              <p className="font-serif font-bold text-xl text-[#0F172A] dark:text-white">Hero Image Area</p>
              <p className="font-sans text-xs text-[#64748B] mt-1">Responsive Placeholder (Aspect Ratio ~3:4)</p>
            </div>
          </div>

          {/* Right Side: Text (55-60%) */}
          <div className="w-full md:w-[55%] flex flex-col items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-8">
              <Shield size={16} className="text-[#64748B]" />
              <span className="text-[#64748B] text-sm font-medium">
                Aligned with Australian Curriculum
              </span>
            </div>

            {/* Heading: Forced Line Break & Responsive Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight font-fraunces font-bold text-[#0F172A]">
              <span className="block sm:hidden text-[#0F172A]">Help Your Child</span>
              <span className="block sm:hidden text-[#0F172A]">Build Academic</span>
              <span className="block sm:hidden italic text-[#6366F1]">Confidence</span>
              <span className="hidden sm:block whitespace-nowrap not-italic">Help Your Child Build</span>
              <span className="hidden sm:block italic text-[#6366F1] mt-1">Academic Confidence</span>
            </h1>

            {/* Subheading */}
            <p className="text-[#334155] text-lg font-sans max-w-lg mb-10 leading-relaxed">
              Personalised assessments, targeted practice, and measurable progress tracking
              to strengthen Maths, Reasoning and Reading skills.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#6366F1] text-white font-semibold text-base transition-transform duration-200 hover:scale-[1.02]"
                style={{ boxShadow: '0 0 18px #6366F140' }}
              >
                Try Free Assessment →
              </Link>

              <button
                onClick={scrollToNext}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[#6366F1] text-[#6366F1] bg-transparent font-semibold text-base transition-colors duration-200 hover:bg-[#6366F1]/5"
              >
                Learn More
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
