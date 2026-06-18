"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Calculator, BookOpen, Brain, PenTool } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { mathAssessment, mockTest, readingAssessment } from "@/app/quiz/data/mockTest";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bundle {
  _id: string;
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  points: string[];
  test_count: number;
}

// ─── Static Free Assessments (yeh backend se nahi aate) ──────────────────────
const FREE_ASSESSMENTS = [
  {
    id: "Mathematical Reasoning",
    title: "Mathematical Reasoning",
    desc: "Test core numerical, geometry, and algebra skills in 40 minutes.",
    icon: Calculator,
    quizId: mathAssessment.id,
    active: true,
    details: ["35 Questions", "Duration: 40 Minutes", "Aligned with NSW Curriculum", "Instant Result", "Know Your Starting Point", "Spot The Gaps Before The Exam Does"]
  },
  {
    id: "Thinking Skills",
    title: "Thinking Skills",
    desc: "Develop sharp logical thinking, analytical reasoning, and problem-solving confidence.",
    icon: Brain,
    quizId: mockTest.id,
    active: true,
    details: ["40 Questions", "Duration: 40 Minutes", "Aligned with NSW Curriculum", "Instant Result", "Know Your Starting Point", "Spot The Gaps Before The Exam Does"]
  },
  {
    id: "Selective Reading",
    title: "Selective Reading",
    desc: "Strengthen comprehension, vocabulary, and critical reading skills for academic success.",
    icon: BookOpen,
    quizId: readingAssessment.id,
    active: true,
    details: ["38 Questions", "Duration: 45 Minutes", "Aligned with NSW Curriculum", "Instant Result", "Know Your Starting Point", "Spot The Gaps Before The Exam Does"]
  },
];

// ─── Mastery bundle highlight karna hai toh index 2 pe hoga ──────────────────
const isMastery = (index: number, total: number) => index === total - 1;

export default function CoursesPage() {
  const [bundles, setBundles]       = useState<Bundle[]>([]);
  const [loading, setLoading]       = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart, isInCart }     = useCart();

  // ─── Fetch bundles from backend ──────────────────────────────────────────
  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/public/bundles`
        );
        const json = await res.json();
        setBundles(json.data || []);
      } catch (err) {
        console.error('Failed to fetch bundles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const handleAddToCart = (bundle: Bundle) => {
    addToCart({
      id: bundle._id,
      title: bundle.title,
      subtitle: bundle.description,
      price: bundle.price,
      subject: "Paid Bundle",
    });
    setToastMessage(`${bundle.title} added to cart.`);
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  // ─── Bundle slug for URL ─────────────────────────────────────────────────
  const getBundleSlug = (bundle: Bundle) =>
    bundle.title.toLowerCase().replace(/\s+/g, '-').replace('-bundle', '');

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
            <span className="font-fraunces font-bold not-italic text-[#0F172A]">Explore Our Test </span>
            <span className="font-fraunces font-bold italic text-[#6366F1]">Series</span>
          </h1>
          <p className="text-[#334155] text-lg font-sans leading-relaxed">
            Choose from our specialized test series and full-curriculum packages designed to prepare students for academic success.
          </p>
        </div>

        {toastMessage && (
          <div className="mx-auto mb-10 max-w-3xl rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium text-center shadow-sm">
            {toastMessage}
          </div>
        )}

        {/* ─── Free Assessments ─────────────────────────────────────────────── */}
        <div className="mb-24">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase tracking-tight">Free Assessment</h2>
            <p className="text-[#64748B] font-sans text-lg">Spot the gaps early. No cost, no commitment — result in 40 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FREE_ASSESSMENTS.map((item) => {
              const SubjectIcon = item.icon;
              return (
                <div key={item.id} className="relative bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#CBD5E1] rounded-3xl p-6 flex flex-col shadow-sm">
                  <span className="absolute top-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-md">FREE</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 mt-4">{item.title}</h3>
                  <p className="text-[#334155] font-sans text-sm mb-6 flex-grow leading-relaxed">{item.desc}</p>
                  <div className="mb-6 font-sans">
                    <p className="text-xs font-bold text-[#6366F1] uppercase tracking-wider mb-3">Details:</p>
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="text-[#334155] text-sm flex items-start gap-2">
                          <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {item.active ? (
                    <Link href={`/quiz/${item.quizId}/instructions`}
                      className="w-full inline-flex items-center justify-center py-3 rounded-2xl bg-[#6366F1] text-white font-sans font-semibold hover:bg-indigo-600 transition-colors">
                      Start Free Assessment →
                    </Link>
                  ) : (
                    <button disabled className="w-full py-3 rounded-2xl bg-[#CBD5E1] text-[#475569] font-sans font-semibold cursor-not-allowed">
                      Coming soon
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Premium Bundles (from backend) ──────────────────────────────── */}
        <div>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase tracking-tight">Premium Bundles</h2>
            <p className="text-[#64748B] font-sans text-lg">Unlock our fully-aligned test packages for complete coverage and intensive prep.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bundles.length === 0 ? (
            <div className="text-center py-16 text-[#64748B]">No bundles available yet.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {bundles.map((bundle, index) => {
                const mastery = isMastery(index, bundles.length);
                const inCart  = isInCart(bundle._id);
                return (
                  <div key={bundle._id}
                    className={`rounded-3xl p-6 flex flex-col shadow-sm relative ${
                      mastery ? "bg-[#6366F1] border border-[#6366F1]" : "bg-white dark:bg-[#1E293B] border border-[#E2E8F0]"
                    }`}>

                    {mastery && (
                      <div className="absolute top-6 right-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6366F1]">
                        BEST VALUE
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-2xl font-serif font-bold mb-2 ${mastery ? "text-white" : "text-[#0F172A]"}`}>
                        {bundle.title}
                      </h3>
                      <p className={`font-sans text-sm leading-relaxed ${mastery ? "text-white/90" : "text-[#64748B]"}`}>
                        {bundle.description}
                      </p>
                    </div>

                    {!mastery && <div className="border-t border-[#E2E8F0] my-4" />}

                    <div className={`mb-6 flex-grow ${mastery ? "border-t border-white/20 pt-4" : ""}`}>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className={`text-4xl font-serif font-bold ${mastery ? "text-white" : "text-[#0F172A]"}`}>
                          {bundle.is_free ? "Free" : `$${bundle.price}`}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className={mastery ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
                          <span className={`font-sans text-sm font-semibold ${mastery ? "text-white" : "text-[#334155]"}`}>
                            Tests: {bundle.test_count}
                          </span>
                        </li>
                        {bundle.points.slice(0, 5).map((point, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <CheckCircle2 size={18} className={mastery ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
                            <span className={`font-sans text-sm ${mastery ? "text-white" : "text-[#334155]"}`}>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex gap-3">
                      <Link href={`/bundles/${bundle._id}`}
                        className={`flex-1 inline-flex items-center justify-center rounded-2xl py-3 text-xs md:text-sm font-semibold transition-colors ${
                          mastery
                            ? "border border-white text-[#6366F1] bg-white hover:bg-gray-100"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}>
                        View Bundle
                      </Link>
                      {!bundle.is_free && (
                        <button onClick={() => handleAddToCart(bundle)} disabled={inCart}
                          className={`flex-1 py-3 rounded-2xl text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
                            inCart
                              ? mastery ? "bg-white/30 text-white cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : mastery ? "bg-white text-[#6366F1] hover:bg-gray-100" : "bg-[#6366F1] text-white hover:bg-indigo-600"
                          }`}>
                          {inCart ? "In Cart" : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}















// "use client";

// import { useState } from "react";
// import { Calculator, BookOpen, Brain, PenTool, Gift, CheckCircle2 } from "lucide-react";
// import Link from "next/link";
// import { mathAssessment, mockTest, readingAssessment, writingAssessment } from "@/app/quiz/data/mockTest";
// import { useCart } from "@/components/CartContext";

// const FREE_ASSESSMENTS = [
//   {
//     id: "Mathematical Reasoning",
//     title: "Mathematical Reasoning",
//     desc: "Test core numerical, geometry, and algebra skills in 40 minutes.",
//     icon: Calculator,
//     quizId: mathAssessment.id,
//     active: true,
//     details: [
//       "35 Questions",
//       "Duration: 40 Minutes",
//       "Aligned with NSW Curriculum",
//       "Instant Result",
//       "Know Your Starting Point",
//       "Spot The Gaps Before The Exam Does"
//     ]
//   },
//   {
//     id: "Thinking Skills",
//     title: "Thinking Skills",
//     desc: "Develop sharp logical thinking, analytical reasoning, and problem-solving confidence.",
//     icon: Brain,
//     quizId: mockTest.id,
//     active: true,
//     details: [
//       "40 Questions",
//       "Duration: 40 Minutes",
//       "Aligned with NSW Curriculum",
//       "Instant Result",
//       "Know Your Starting Point",
//       "Spot The Gaps Before The Exam Does"
//     ]
//   },
//   {
//     id: "Selective Reading",
//     title: "Selective Reading",
//     desc: "Strengthen comprehension, vocabulary, and critical reading skills for academic success.",
//     icon: BookOpen,
//     quizId: readingAssessment.id,
//     active: true,
//     details: [
//       "38 Questions",
//       "Duration: 45 Minutes",
//       "Aligned with NSW Curriculum",
//       "Instant Result",
//       "Know Your Starting Point",
//       "Spot The Gaps Before The Exam Does"
//     ]
//   }
// ];

// const BUNDLES = [
//   {
//     id: "foundation-bundle",
//     title: "Foundation Bundle",
//     desc: "Perfect for building confidence and strengthening core Year 6 skills.",
//     price: 79,
//     duration: "1 Year",
//     testsPerSubject: 10,
//     totalTests: 40,
//     subjects: ["Mathematical Reasoning", "Thinking Skills", "Selective Reading", "Writing Skills"],
//     bgTint: "bg-[#F0FDF4]",
//     textClass: "text-[#16A34A]",
//     totalQuestionsText: "1,200+",
//     prepTime: "26+ Hours",
//   },
//   {
//     id: "advance-bundle",
//     title: "Advance Bundle",
//     desc: "Extended practice and targeted revision for consistent improvement.",
//     price: 129,
//     duration: "1 Year",
//     testsPerSubject: 20,
//     totalTests: 80,
//     subjects: ["Mathematical Reasoning", "Thinking Skills", "Selective Reading", "Writing Skills"],
//     bgTint: "bg-[#EEF2FF]",
//     textClass: "text-[#6366F1]",
//     totalQuestionsText: "2,300+",
//     prepTime: "52+ Hours",
//   },
//   {
//     id: "mastery-bundle",
//     title: "Mastery Bundle",
//     desc: "Our most comprehensive package for ambitious students seeking top results.",
//     price: 247,
//     duration: "2 Years",
//     testsPerSubject: 40,
//     totalTests: 160,
//     subjects: ["Mathematical Reasoning", "Thinking Skills", "Selective Reading", "Writing Skills"],
//     bgTint: "bg-[#FFF7ED]",
//     textClass: "text-[#EA580C]",
//     totalQuestionsText: "4,500+",
//     prepTime: "100+ Hours",
//   },
// ];

// export default function CoursesPage() {
//   const [toastMessage, setToastMessage] = useState("");
//   const { addToCart, isInCart } = useCart();

//   const handleAddToCart = (bundle: typeof BUNDLES[0]) => {
//     addToCart({
//       id: bundle.id,
//       title: bundle.title,
//       subtitle: bundle.desc,
//       price: bundle.price,
//       subject: "Paid Bundle",
//     });
//     setToastMessage(`${bundle.title} added to cart.`);
//     window.setTimeout(() => setToastMessage(""), 2800);
//   };

//   return (
//     <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
//       <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
//         {/* Section 1: Header */}
//         <div className="text-center mb-16 max-w-3xl mx-auto">
//           <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
//             <span className="font-fraunces font-bold not-italic text-[#0F172A]">
//               Explore Our Test{" "}
//             </span>
//             <br className="md:hidden" />
//             <span className="font-fraunces font-bold italic text-[#6366F1]">
//               Series
//             </span>
//           </h1>
//           <p className="text-[#334155] text-lg font-sans leading-relaxed">
//             Choose from our specialized test series and full-curriculum packages designed to prepare students for academic success.
//           </p>
//         </div>

//         {toastMessage ? (
//           <div className="mx-auto mb-10 max-w-3xl rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium text-center shadow-sm">
//             {toastMessage}
//           </div>
//         ) : null}

//         {/* Free Assessment Section */}
//         <div className="mb-24">
//           <div className="mb-10 text-center max-w-2xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase tracking-tight">
//               Free Assessment
//             </h2>
//             <p className="text-[#64748B] font-sans text-lg">
//               Spot the gaps early. No cost, no commitment — result in 40 minutes.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {FREE_ASSESSMENTS.map((item) => {
//               const SubjectIcon = item.icon;
//               return (
//                 <div
//                   key={item.id}
//                   className="relative bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#CBD5E1] rounded-3xl p-6 flex flex-col shadow-sm"
//                 >
//                   <span className="absolute top-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-md">
//                     FREE
//                   </span>

//                   <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 mt-4">
//                     {item.title}
//                   </h3>
                  
//                   <p className="text-[#334155] font-sans text-sm mb-6 flex-grow leading-relaxed">
//                     {item.desc}
//                   </p>

//                   <div className="mb-6 font-sans">
//                     <p className="text-xs font-bold text-[#6366F1] uppercase tracking-wider mb-3">Details:</p>
//                     <ul className="space-y-2">
//                       {item.details.map((detail, idx) => (
//                         <li key={idx} className="text-[#334155] text-sm flex items-start gap-2">
//                           <span className="text-[#6366F1] font-bold mt-0.5">•</span>
//                           {detail}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {item.active ? (
//                     <Link
//                       href={`/quiz/${item.quizId}/instructions`}
//                       className="w-full inline-flex items-center justify-center py-3 rounded-2xl bg-[#6366F1] text-white font-sans font-semibold hover:bg-indigo-600 transition-colors"
//                     >
//                       Start Free Assessment →
//                     </Link>
//                   ) : (
//                     <button
//                       disabled
//                       className="w-full py-3 rounded-2xl bg-[#CBD5E1] text-[#475569] font-sans font-semibold cursor-not-allowed"
//                     >
//                       Coming soon
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bundle Section */}
//         <div>
//           <div className="mb-10 text-center max-w-2xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase tracking-tight">
//               Premium Bundles
//             </h2>
//             <p className="text-[#64748B] font-sans text-lg">
//               Unlock our fully-aligned test packages for complete coverage and intensive prep.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {BUNDLES.map((bundle) => (
//               <div
//                 key={bundle.id}
//                 className={`rounded-3xl p-6 flex flex-col shadow-sm relative ${
//                   bundle.id === "mastery-bundle"
//                     ? "bg-[#6366F1] border border-[#6366F1]"
//                     : "bg-white dark:bg-[#1E293B] border border-[#E2E8F0]"
//                 }`}
//               >
//                 {bundle.id === "mastery-bundle" ? (
//                   <div className="absolute top-6 right-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6366F1]">
//                     BEST VALUE
//                   </div>
//                 ) : null}
//                 <div className="mb-6">
//                   <h3 className={`text-2xl font-serif font-bold mb-2 ${
//                     bundle.id === "mastery-bundle" ? "text-white" : "text-[#0F172A]"
//                   }`}>
//                     {bundle.title}
//                   </h3>
//                   <p className={`font-sans text-sm leading-relaxed ${
//                     bundle.id === "mastery-bundle" ? "text-white/90" : "text-[#64748B]"
//                   }`}>
//                     {bundle.desc}
//                   </p>
//                 </div>

//                 {bundle.id !== "mastery-bundle" && <div className="border-t border-[#E2E8F0] my-4"></div>}

//                 <div className={`mb-6 flex-grow ${
//                   bundle.id === "mastery-bundle" ? "border-t border-white/20 pt-4" : ""
//                 }`}>
//                   <div className="flex items-baseline gap-1">
//                     <span className={`text-4xl font-serif font-bold ${
//                       bundle.id === "mastery-bundle" ? "text-white" : "text-[#0F172A]"
//                     }`}>
//                       ${bundle.price}
//                     </span>
//                   </div>
                  
//                   <ul className="flex flex-col gap-3 mt-6">
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm font-semibold ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Tests: {bundle.totalTests}
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Duration: {bundle.duration}
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Subjects: {bundle.subjects.join(", ")}
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm font-semibold ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Questions: {bundle.totalQuestionsText}
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Preparation Time: {bundle.prepTime}
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Aligned with NSW Curriculum
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Detailed Analysis For Every Test
//                       </span>
//                     </li>
//                     <li className="flex items-center gap-2.5">
//                       <CheckCircle2 size={18} className={bundle.id === "mastery-bundle" ? "text-white shrink-0" : "text-[#16A34A] shrink-0"} />
//                       <span className={`font-sans text-sm ${
//                         bundle.id === "mastery-bundle" ? "text-white" : "text-[#334155]"
//                       }`}>
//                         Instant Results
//                       </span>
//                     </li>
//                     {bundle.id === "foundation-bundle" && (
//                       <li className="flex items-center gap-2.5">
//                         <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
//                         <span className="text-[#334155] font-sans text-sm">
//                           Notes
//                         </span>
//                       </li>
//                     )}
//                   </ul>
//                 </div>

//                 <div className="mt-auto flex gap-3">
//                   <Link
//                     href={`/bundles/${bundle.id.replace("-bundle", "")}`}
//                     className={`flex-1 inline-flex items-center justify-center rounded-2xl py-3 text-xs md:text-sm font-semibold transition-colors ${
//                       bundle.id === "mastery-bundle"
//                         ? "border border-white text-[#6366F1] bg-white hover:bg-gray-100"
//                         : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
//                     }`}
//                   >
//                     View Bundle
//                   </Link>
//                   <button
//                     onClick={() => handleAddToCart(bundle)}
//                     disabled={isInCart(bundle.id)}
//                     className={`flex-1 py-3 rounded-2xl text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
//                       isInCart(bundle.id)
//                         ? bundle.id === "mastery-bundle"
//                           ? "bg-white/30 text-white cursor-not-allowed"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                         : bundle.id === "mastery-bundle"
//                         ? "bg-white text-[#6366F1] hover:bg-gray-100"
//                         : "bg-[#6366F1] text-white hover:bg-indigo-600"
//                     }`}
//                   >
//                     {isInCart(bundle.id) ? "In Cart" : "Add to Cart"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
