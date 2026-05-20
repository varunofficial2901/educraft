"use client";

import { Calculator, BookOpen, Brain } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const COURSES = [
  {
    id: 1,
    title: "Mathematics",
    description: "Core numerical skills and curriculum-aligned mathematical mastery.",
    icon: Calculator,
    accent: "#16A34A",
    bgTint: "bg-[#F0FDF4]",
    borderColor: "border-[#BBF7D0]",
    shadowHover: "hover:shadow-[0_10px_30px_rgba(22,163,74,0.15)]",
    iconColor: "text-[#16A34A]",
  },
  {
    id: 2,
    title: "Reading Skills",
    description: "Comprehension, vocabulary, and critical reading confidence.",
    icon: BookOpen,
    accent: "#EA580C",
    bgTint: "bg-[#FFF7ED]",
    borderColor: "border-[#FED7AA]",
    shadowHover: "hover:shadow-[0_10px_30px_rgba(234,88,12,0.15)]",
    iconColor: "text-[#EA580C]",
  },
  {
    id: 3,
    title: "Reasoning",
    description: "Sharp logical thinking, analytical reasoning, and problem-solving.",
    icon: Brain,
    accent: "#6366F1",
    bgTint: "bg-[#EEF2FF]",
    borderColor: "border-[#C7D2FE]",
    shadowHover: "hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]",
    iconColor: "text-[#6366F1]",
  },
];

export default function CoursesCarousel() {
  return (
    <section id="courses" className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6">
            What Your Child Will Master
          </h2>
          <p className="text-[#334155] text-lg font-sans leading-relaxed">
            Structured learning across Mathematics, English, and Reasoning — with timed
            tests, detailed performance insights, and targeted practice designed to build confidence
            and measurable academic growth.
          </p>
        </div>

        {/* Feature Showcase Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {COURSES.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className={`group relative bg-white rounded-2xl border ${course.borderColor} p-8 transition-all duration-300 hover:-translate-y-1 ${course.shadowHover} flex flex-col items-start`}
              >
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-xl ${course.bgTint} flex items-center justify-center ${course.iconColor} mb-6 transition-transform group-hover:scale-110`}>
                  <Icon size={28} strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-3">
                  {course.title}
                </h3>

                <p className="text-[#334155] font-sans text-base leading-relaxed">
                  {course.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#6366F1] text-white font-serif font-medium text-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-indigo-600 shadow-md"
          >
            View All Test Bundles →
          </Link>
        </div>

      </div>
    </section>
  );
}
