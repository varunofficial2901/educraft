"use client";

import { useState } from "react";
import { Calculator, BookOpen, Brain, Gift, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mathAssessment, mockTest } from "@/app/quiz/data/mockTest";
import { useCart } from "@/components/CartContext";

const SUBJECTS = [
  {
    id: "Mathematics",
    name: "MATHEMATICS",
    desc: "Build strong numerical skills, problem-solving confidence, and curriculum-aligned mathematical mastery.",
    color: {
      accent: "#16A34A",
      bgTint: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
      text: "text-[#16A34A]"
    },
    icon: Calculator,
    freeTitle: "Maths Free Assessment",
    packs: [
            {
        id: "maths-pack-1",
        title: "MATHS PACK 1",
        price: 100000,
        sub: "Build core maths skills and exam-ready confidence.",
        points: ["Curriculum-aligned problems", "Timed practice sets", "Step-by-step solutions"]
      },
      {
        id: "maths-pack-2",
        title: "MATHS PACK 2",
        price: 200000,
        sub: "Strengthen advanced problem-solving and exam confidence.",
        points: ["Multi-step problem solving", "Word problems & logic", "Strategy-based practice"]
      }
    ]
  },
  {
    id: "Reasoning",
    name: "REASONING",
    desc: "Develop sharp logical thinking, analytical reasoning, and problem-solving confidence.",
    color: {
      accent: "#6366F1",
      bgTint: "bg-[#EEF2FF]",
      border: "border-[#C7D2FE]",
      text: "text-[#6366F1]"
    },
    icon: Brain,
    freeTitle: "Reasoning Free Assessment",
    packs: [
            {
        id: "reasoning-pack-1",
        title: "REASONING PACK 1",
        price: 200000,
        sub: "Strengthen reasoning speed, patterns, and analytical thinking.",
        points: ["Pattern recognition", "Sequences & codes", "Logical deduction"]
      },
      {
        id: "reasoning-pack-2",
        title: "REASONING PACK 2",
        price: 300000,
        sub: "Build advanced logic through challenging exam-style questions.",
        points: ["Multi-step reasoning", "Analytical puzzles", "Decision-making skills"]
      }
    ]
  },
  {
    id: "Reading Skills",
    name: "READING SKILLS",
    desc: "Strengthen comprehension, vocabulary, and critical reading skills for academic success.",
    color: {
      accent: "#EA580C",
      bgTint: "bg-[#FFF7ED]",
      border: "border-[#FED7AA]",
      text: "text-[#EA580C]"
    },
    icon: BookOpen,
    freeTitle: "Reading Skills Free Assessment",
    packs: [
            {
        id: "reading-pack-1",
        title: "READING FOUNDATIONS PACK",
        price: 300000,
        sub: "Build essential comprehension and vocabulary through structured practice.",
        points: ["Reading comprehension", "Vocabulary growth", "Sentence analysis"]
      },
      {
        id: "reading-pack-2",
        title: "ADVANCED READING SKILLS PACK",
        price: 400000,
        sub: "Develop deeper interpretation, inference, and critical reading confidence.",
        points: ["Inference skills", "Text analysis", "Critical interpretation"]
      }
    ]
  }
];

export default function CoursesPage() {
  const [filter, setFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart, isInCart } = useCart();

  const TABS = ["All", "Mathematics", "Reasoning", "Reading Skills", "Free"];

  const handleAddToCart = (subject: typeof SUBJECTS[0], pack: (typeof SUBJECTS)[0]["packs"][0]) => {
    addToCart({
      id: `${subject.id}-${pack.id}`,
      title: pack.title,
      subtitle: pack.sub,
      price: pack.price,
      subject: subject.name,
    });
    setToastMessage(`${pack.title} added to cart.`);
    window.setTimeout(() => setToastMessage(""), 2800);
  };
  const renderSubject = (subjectData: typeof SUBJECTS[0]) => {
    if (filter !== "All" && filter !== "Free" && filter !== subjectData.id) return null;

    const SubjectIcon = subjectData.icon;

    return (
      <div key={subjectData.id} className="mb-20">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase">
            {subjectData.name}
          </h2>
          <p className="text-[#64748B] font-sans text-lg">
            {subjectData.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Free Card */}
          {(filter === "All" || filter === "Free" || filter === subjectData.id) && (
            <div className="relative bg-[#EEF2FF] dark:bg-[#1E293B] border-2 border-dashed border-[#6366F1] rounded-2xl p-6 flex flex-col min-h-[300px]">
              <span className="absolute top-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-md">
                FREE
              </span>
              
              <div className="mt-8 flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                  <Gift size={24} />
                </div>
                <SubjectIcon size={20} className="text-[#64748B] opacity-50" />
              </div>

              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2">
                {subjectData.freeTitle}
              </h3>
              <p className="text-[#334155] font-sans text-sm mb-6 flex-grow">
                Spot the gaps early. No cost, no commitment — results in 40 minutes.
              </p>

              {(subjectData.id === "Mathematics" || subjectData.id === "Reasoning") ? (
                <Link
                  href={`/quiz/${subjectData.id === "Mathematics" ? mathAssessment.id : mockTest.id}/instructions`}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-[#6366F1] text-white font-sans font-medium hover:bg-indigo-600 transition-colors"
                >
                  Start Free Assessment →
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-[#CBD5E1] text-[#475569] font-sans font-medium cursor-not-allowed"
                >
                  Coming soon
                </button>
              )}
            </div>
          )}

          {/* Paid Packs */}
          {filter !== "Free" && subjectData.packs.map((pack, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] shadow-sm rounded-2xl p-6 flex flex-col min-h-[260px] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${subjectData.color.bgTint} flex items-center justify-center ${subjectData.color.text}`}>
                  <SubjectIcon size={24} />
                </div>
                <span className="bg-[#F1F5F9] text-[#64748B] text-xs font-medium rounded-md px-2 py-0.5">
                  CORE
                </span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2">
                {pack.title}
              </h3>
              <p className="text-[#64748B] font-sans text-sm line-clamp-2 min-h-[40px] mb-4">
                {pack.sub}
              </p>

              <div className="border-t border-[#E2E8F0] my-4"></div>

              <div className="mb-6 flex-grow">
                <div className="text-[#0F172A] font-semibold text-lg">₹{pack.price.toLocaleString("en-IN")}</div>
                <ul className="flex flex-col gap-2.5 mt-4">
                  {pack.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="text-[#334155] font-sans text-sm leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleAddToCart(subjectData, pack)}
                disabled={isInCart(`${subjectData.id}-${pack.id}`)}
                className={`mt-auto w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isInCart(`${subjectData.id}-${pack.id}`)
                    ? "bg-[#E5E7EB] text-[#475569] cursor-not-allowed"
                    : "bg-[#6366F1] text-white hover:bg-indigo-600"
                }`}
              >
                {isInCart(`${subjectData.id}-${pack.id}`) ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
            <span className="font-fraunces font-bold not-italic text-[#0F172A]">
              Explore Our Test{' '}
            </span>
            <br className="md:hidden" />
            <span className="font-fraunces font-bold italic text-[#6366F1]">
              Series
            </span>
          </h1>
          <p className="text-[#334155] text-lg font-sans leading-relaxed">
            Comprehensive, curriculum-aligned test bundles designed to strengthen Maths, Reasoning, and English through structured practice, timed assessments, and measurable progress.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-xl font-sans font-medium transition-colors ${
                filter === tab 
                  ? "bg-[#6366F1] text-white" 
                  : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {toastMessage ? (
          <div className="mx-auto mb-8 max-w-3xl rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium">
            {toastMessage}
          </div>
        ) : null}

        {/* Subjects Content */}
        <div>
          {SUBJECTS.map((subject) => renderSubject(subject))}
        </div>

      </div>
    </div>
  );
}
