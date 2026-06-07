"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, BookOpen, Brain, PenTool, CheckCircle2, Shield, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

const BUNDLES_DATA: Record<string, {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  testsPerSubject: number;
  benefits: string[];
}> = {
  foundation: {
    id: "foundation-bundle",
    name: "Foundation Bundle",
    description: "Perfect for building confidence and strengthening core Year 6 skills.",
    price: 79,
    duration: "1 Year",
    testsPerSubject: 10,
    benefits: [
      "Strongly aligned with NSW curriculum outcomes.",
      "Comprehensive diagnostic feedback on core concepts.",
      "Engaging practice questions with step-by-step explanations.",
      "Ideal starting point for selective school and scholarship prep.",
      "Access to standard difficulty practice papers."
    ]
  },
  advance: {
    id: "advance-bundle",
    name: "Advance Bundle",
    description: "Extended practice and targeted revision for consistent improvement.",
    price: 129,
    duration: "1 Year",
    testsPerSubject: 20,
    benefits: [
      "Extended repository of exam-style mock tests.",
      "In-depth reasoning and advanced numerical exercises.",
      "Comprehensive reading comprehension modules covering inference and analysis.",
      "Access to medium and high difficulty practice sets.",
      "Detailed progress monitoring tools on the Student Dashboard."
    ]
  },
  mastery: {
    id: "mastery-bundle",
    name: "Mastery Bundle",
    description: "Our most comprehensive package for ambitious students seeking top results.",
    price: 247,
    duration: "2 Years",
    testsPerSubject: 40,
    benefits: [
      "Strongly aligned with NSW curriculum outcomes.",
      "Complete set of challenging mock papers matching selective tests.",
      "Comprehensive writing prompt evaluations (teacher-reviewed format).",
      "Full coverage of advanced numerical, logical, and verbal reasoning.",
      "Priority updates when new test papers and exercises are published."
    ]
  }
};

const SUBJECT_DESCRIPTIONS = {
  math: "Build numerical fluency, confidence, and exam readiness through structured practice.",
  reasoning: "Strengthen logical thinking, analytical skills, and problem-solving ability.",
  reading: "Improve comprehension, interpretation, inference, and vocabulary development.",
  writing: "Receive teacher-reviewed writing assessments with detailed feedback reports designed to improve grammar, vocabulary, structure, and written communication skills."
};

export default function BundleDetailPage({ params }: { params: any }) {
  const router = useRouter();
  const resolvedParams = use<{ bundleId: string }>(params);
  const bundleId = resolvedParams.bundleId;
  const { addToCart, isInCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");

  const bundle = BUNDLES_DATA[bundleId];

  // If bundleId is invalid, return not found page
  if (!bundle) {
    return (
      <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Bundle Not Found</h1>
        <p className="text-gray-500 mb-6">The bundle page you are looking for does not exist.</p>
        <Link href="/courses" className="px-6 py-3 bg-[#6366F1] text-white rounded-xl font-semibold">
          Back to Test Series
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: bundle.id,
      title: bundle.name,
      subtitle: bundle.description,
      price: bundle.price,
      subject: "Test Bundle",
    });
    setToastMessage(`${bundle.name} added to cart.`);
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  const handleCheckout = () => {
    if (!isInCart(bundle.id)) {
      addToCart({
        id: bundle.id,
        title: bundle.name,
        subtitle: bundle.description,
        price: bundle.price,
        subject: "Test Bundle",
      });
    }
    router.push("/cart");
  };

  const heroTag = bundleId === "foundation" ? "FOUNDATION" : bundleId === "advance" ? "ADVANCE" : "MASTERY";

  // Reusable Purchase Card Component
  const PurchaseCard = ({ isMobile }: { isMobile?: boolean }) => {
    const inCart = isInCart(bundle.id);
    return (
      <div className={`bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 shadow-sm ${!isMobile ? "sticky top-[120px]" : "mb-8"}`}>
        <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2">
          {bundle.name}
        </h3>
        
        <div className="flex items-baseline gap-1.5 mb-6 text-gray-900 dark:text-white">
          <span className="text-4xl font-bold font-serif">${bundle.price}</span>
        </div>

        <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-300 font-sans">
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
            <span>Duration</span>
            <span className="font-semibold">{bundle.duration}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
            <span>Total tests</span>
            <span className="font-semibold">{bundle.testsPerSubject * 4} Tests ({bundle.testsPerSubject} per subject)</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors cursor-pointer ${
              inCart
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#6366F1] text-white hover:bg-indigo-600"
            }`}
          >
            {inCart ? "Added to Cart" : "Add to Cart"}
          </button>

          <button
            onClick={handleCheckout}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  };

  const SUBJECTS = [
    { slug: "mathematics", name: "Mathematics", icon: Calculator, color: "text-[#16A34A]", bg: "bg-[#F0FDF4]", desc: SUBJECT_DESCRIPTIONS.math },
    { slug: "reasoning", name: "Reasoning", icon: Brain, color: "text-[#6366F1]", bg: "bg-[#EEF2FF]", desc: SUBJECT_DESCRIPTIONS.reasoning },
    { slug: "reading-skills", name: "Reading Skills", icon: BookOpen, color: "text-[#EA580C]", bg: "bg-[#FFF7ED]", desc: SUBJECT_DESCRIPTIONS.reading },
    { slug: "writing-skills", name: "Writing Skills", icon: PenTool, color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]", desc: SUBJECT_DESCRIPTIONS.writing }
  ];

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:underline mb-6 font-sans">
          <ArrowLeft size={16} /> Back to Test Series
        </Link>

        {toastMessage ? (
          <div className="mb-6 rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium text-center shadow-sm font-sans">
            {toastMessage}
          </div>
        ) : null}

        {/* 1. Bundle Header Section (Above the fold) */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 shadow-sm border border-[#E2E8F0] relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#C7D2FE] opacity-30 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-[#FCE7F3] opacity-40 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#6366F1] bg-[#EEF2FF] px-3 py-1.5 rounded-full">
              {heroTag}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-3 text-slate-950">
              {bundle.name}
            </h1>
            <p className="text-slate-600 font-sans text-base md:text-lg mb-8 leading-relaxed">
              {bundle.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Price</p>
                <p className="text-2xl font-bold font-serif mt-2 text-slate-950">${bundle.price}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Duration</p>
                <p className="text-2xl font-bold font-serif mt-2 text-slate-950">{bundle.duration}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Total Tests</p>
                <p className="text-2xl font-bold font-serif mt-2 text-slate-950">{bundle.testsPerSubject * 4}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop and Mobile Responsive Layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Main Content Details */}
          <div className="lg:col-span-2 space-y-8 font-sans">
            
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Bundle Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                Our {bundle.name} provides comprehensive prep materials tailored for ambitious students seeking top results in selective school entrance exams and academic scholarships.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                Featuring structured exam practice sets, curriculum-aligned questions, and detailed answers, this bundle helps students identify weak points and build core academic confidence.
              </p>
              <div className="rounded-3xl bg-[#EEF2FF] dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 p-6">
                <ul className="space-y-3 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6366F1] font-bold mt-0.5">✓</span>
                    <span>Strongly aligned with NSW curriculum outcomes.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile Only: Purchase Card */}
            <div className="lg:hidden block">
              <PurchaseCard isMobile={true} />
            </div>

            {/* Subject Cards Section (Vertical Layout) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white px-2">
                Subjects Included ({bundle.testsPerSubject} tests per subject)
              </h2>

              <div className="flex flex-col gap-4">
                {SUBJECTS.map((subject, index) => {
                  const Icon = subject.icon;
                  return (
                    <Link
                      href={`/bundles/${bundleId}/${subject.slug}`}
                      key={index}
                      className="group bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-[#6366F1] hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${subject.bg} flex items-center justify-center ${subject.color} shrink-0`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-[#0F172A] dark:text-white group-hover:text-[#6366F1] transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-[#64748B] font-sans text-xs md:text-sm mt-1 leading-relaxed">
                            {subject.desc}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto text-right shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 rounded-xl block sm:inline text-center">
                          {bundle.testsPerSubject} Tests →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bundle Benefits */}
            <div className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                What You Get With This Bundle
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundle.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Information Details */}
            <div className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Test Taking Information
              </h2>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-slate-900 text-[#6366F1] rounded-xl shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-gray-900 dark:text-white mb-1">
                    Exam-style Simulation Mode
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    All tests feature timed sessions and detailed review reports. Students can resume tests anytime from localStorage if they navigate away during practice, making structured study easily manageable.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Desktop Sticky Purchase Card (Only on Bundle details) */}
          <div className="hidden lg:block relative h-full">
            <PurchaseCard isMobile={false} />
          </div>

        </div>

      </div>
    </div>
  );
}
