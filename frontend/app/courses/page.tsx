// "use client";

// import { useState, useEffect } from "react";
// import { Calculator, BookOpen, Brain, Gift, CheckCircle2, Package } from "lucide-react";
// import Link from "next/link";
// import { mathAssessment, mockTest } from "@/app/quiz/data/mockTest";
// import { useCart } from "@/components/CartContext";

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// // ─── Free Assessment quiz mapping ─────────────────────────────────────────────
// const QUIZ_MAP: Record<string, string> = {
//   mathematics:      mathAssessment.id,
//   math:             mathAssessment.id,
//   reasoning:        mockTest.id,
//   "reading skills": mockTest.id,
// };

// function getQuizId(title: string): string | null {
//   const key = title.toLowerCase();
//   for (const k in QUIZ_MAP) { if (key.includes(k)) return QUIZ_MAP[k]; }
//   return null;
// }

// // ─── Bundle Card ──────────────────────────────────────────────────────────────
// function BundleCard({ bundle, onAddToCart, inCart }: {
//   bundle: any;
//   onAddToCart: () => void;
//   inCart: boolean;
// }) {
//   if (bundle.is_free) {
//     return (
//       <div className="relative bg-[#EEF2FF] dark:bg-[#1E293B] border-2 border-dashed border-[#6366F1] rounded-2xl p-8 flex flex-col">
//         <span className="absolute top-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-md">FREE</span>
//         <div className="mt-6 mb-4">
//           <div className="w-14 h-14 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
//             <Gift size={28} />
//           </div>
//         </div>
//         <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-3">{bundle.title}</h3>
//         <p className="text-[#334155] font-sans text-base mb-6 flex-grow">{bundle.description}</p>

//         {bundle.points?.length > 0 && (
//           <ul className="flex flex-col gap-2.5 mb-6">
//             {bundle.points.map((pt: string, i: number) => (
//               <li key={i} className="flex items-start gap-2">
//                 <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
//                 <span className="text-[#334155] font-sans text-sm">{pt}</span>
//               </li>
//             ))}
//           </ul>
//         )}

//         <Link
//           href={`/quiz/${mathAssessment.id}/instructions`}
//           className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-[#6366F1] text-white font-sans font-semibold hover:bg-indigo-600 transition-colors"
//         >
//           Start Free Assessment →
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] shadow-sm rounded-2xl p-8 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
//       <div className="flex justify-between items-start mb-6">
//         <div className="w-14 h-14 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#6366F1]">
//           <Package size={28} />
//         </div>
//         <span className="bg-[#F1F5F9] text-[#64748B] text-xs font-medium rounded-md px-2 py-1">BUNDLE</span>
//       </div>

//       <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-3">{bundle.title}</h3>
//       <p className="text-[#64748B] font-sans text-sm mb-4 flex-grow">{bundle.description}</p>

//       <div className="border-t border-[#E2E8F0] my-4" />

//       <div className="text-[#0F172A] font-bold text-2xl mb-4">
//         ₹{(bundle.price || 0).toLocaleString("en-IN")}
//       </div>

//       {bundle.points?.length > 0 && (
//         <ul className="flex flex-col gap-2.5 mb-6">
//           {bundle.points.map((pt: string, i: number) => (
//             <li key={i} className="flex items-start gap-2">
//               <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
//               <span className="text-[#334155] font-sans text-sm">{pt}</span>
//             </li>
//           ))}
//         </ul>
//       )}

//       <button
//         onClick={onAddToCart}
//         disabled={inCart}
//         className={`mt-auto w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
//           inCart
//             ? "bg-[#E5E7EB] text-[#475569] cursor-not-allowed"
//             : "bg-[#6366F1] text-white hover:bg-indigo-600"
//         }`}
//       >
//         {inCart ? "✓ Added to Cart" : "Add to Cart"}
//       </button>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function CoursesPage() {
//   const [bundles, setBundles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [toastMessage, setToastMessage] = useState("");
//   const { addToCart, isInCart } = useCart();

//   useEffect(() => {
//     fetch(`${API}/api/v1/bundles`)
//       .then(r => r.json())
//       .then(d => {
//         const data = d.data || [];
//         // Sort: free first, then paid
//         const sorted = [...data].sort((a, b) => {
//           if (a.is_free && !b.is_free) return -1;
//           if (!a.is_free && b.is_free) return 1;
//           return 0;
//         });
//         setBundles(sorted);
//       })
//       .catch(() => setBundles([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleAddToCart = (bundle: any) => {
//     addToCart({
//       id: bundle._id,
//       title: bundle.title,
//       subtitle: bundle.description,
//       price: bundle.price,
//       subject: bundle.subject || "",
//     });
//     setToastMessage(`${bundle.title} added to cart!`);
//     window.setTimeout(() => setToastMessage(""), 2800);
//   };

//   return (
//     <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
//       <div className="container mx-auto px-4 md:px-8 max-w-7xl">

//         {/* Header */}
//         <div className="text-center mb-12 max-w-3xl mx-auto">
//           <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
//             <span className="font-fraunces font-bold not-italic text-[#0F172A]">Explore Our Test{' '}</span>
//             <br className="md:hidden" />
//             <span className="font-fraunces font-bold italic text-[#6366F1]">Bundles</span>
//           </h1>
//           <p className="text-[#334155] text-lg font-sans leading-relaxed">
//             Comprehensive, curriculum-aligned test bundles designed to strengthen Maths, Reasoning, and English through structured practice, timed assessments, and measurable progress.
//           </p>
//         </div>

//         {/* Toast */}
//         {toastMessage && (
//           <div className="mx-auto mb-8 max-w-3xl rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium text-center">
//             ✓ {toastMessage}
//           </div>
//         )}

//         {/* Bundles Grid */}
//         {loading ? (
//           <div className="text-center text-[#64748B] py-20">Loading bundles...</div>
//         ) : bundles.length === 0 ? (
//           <div className="text-center text-[#64748B] py-20">No bundles available yet.</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {bundles.map((bundle) => (
//               <BundleCard
//                 key={bundle._id}
//                 bundle={bundle}
//                 onAddToCart={() => handleAddToCart(bundle)}
//                 inCart={isInCart(bundle._id)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Calculator, BookOpen, Brain, Gift, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mathAssessment, mockTest } from "@/app/quiz/data/mockTest";
import { useCart } from "@/components/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ICON_MAP: Record<string, any> = {
  mathematics: Calculator,
  math: Calculator,
  reasoning: Brain,
  reading: BookOpen,
  "reading skills": BookOpen,
};

const COLOR_MAP: Record<string, any> = {
  mathematics: { accent: "#16A34A", bgTint: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
  math:        { accent: "#16A34A", bgTint: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
  reasoning:   { accent: "#6366F1", bgTint: "bg-[#EEF2FF]", text: "text-[#6366F1]" },
  reading:     { accent: "#EA580C", bgTint: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
  "reading skills": { accent: "#EA580C", bgTint: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
};

const QUIZ_MAP: Record<string, string> = {
  mathematics: mathAssessment.id,
  math:        mathAssessment.id,
  reasoning:   mockTest.id,
};

function getIcon(title: string) {
  const key = title.toLowerCase();
  for (const k in ICON_MAP) { if (key.includes(k)) return ICON_MAP[k]; }
  return BookOpen;
}

function getColor(title: string) {
  const key = title.toLowerCase();
  for (const k in COLOR_MAP) { if (key.includes(k)) return COLOR_MAP[k]; }
  return { accent: "#6366F1", bgTint: "bg-[#EEF2FF]", text: "text-[#6366F1]" };
}

function getQuizId(title: string): string | null {
  const key = title.toLowerCase();
  for (const k in QUIZ_MAP) { if (key.includes(k)) return QUIZ_MAP[k]; }
  return null;
}

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetch(`${API}/api/v1/courses/public/all`)
      .then(r => r.json())
      .then(async (d) => {
        const courses = d.data || [];
        const full = await Promise.all(
          courses.map(async (c: any) => {
            const res = await fetch(`${API}/api/v1/courses/public/${c._id}/tests`);
            const json = await res.json();
            return { ...c, packs: json.data?.paidTests || [], freeTests: json.data?.freeTests || [] };
          })
        );
        setSubjects(full);
      })
      .catch(() => setSubjects([]));
  }, []);

  const TABS = ["All", ...subjects.map(s => s.title), "Free"];

  const handleAddToCart = (course: any, pack: any) => {
    addToCart({
      id: `${course._id}-${pack._id}`,
      title: pack.title,
      subtitle: pack.description,
      price: pack.price,
      subject: course.title,
    });
    setToastMessage(`${pack.title} added to cart.`);
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  const renderSubject = (course: any) => {
    if (filter !== "All" && filter !== "Free" && filter !== course.title) return null;

    const SubjectIcon = getIcon(course.title);
    const color = getColor(course.title);
    const quizId = getQuizId(course.title);

    return (
      <div key={course._id} className="mb-20">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-3 uppercase">
            {course.title}
          </h2>
          <p className="text-[#64748B] font-sans text-lg">{course.description}</p>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>

          {/* Free Assessment Card */}
          {(filter === "All" || filter === "Free" || filter === course.title) && (
            <div className="relative bg-[#EEF2FF] dark:bg-[#1E293B] border-2 border-dashed border-[#6366F1] rounded-2xl p-6 flex flex-col min-h-[300px] shrink-0 w-[320px] snap-start">
              <span className="absolute top-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-md">FREE</span>
              <div className="mt-8 flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                  <Gift size={24} />
                </div>
                <SubjectIcon size={20} className="text-[#64748B] opacity-50" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2">
                {course.title} Free Assessment
              </h3>
              <p className="text-[#334155] font-sans text-sm mb-6 flex-grow">
                Spot the gaps early. No cost, no commitment — results in 40 minutes.
              </p>
              {quizId ? (
                <Link href={`/quiz/${quizId}/instructions`}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-[#6366F1] text-white font-sans font-medium hover:bg-indigo-600 transition-colors">
                  Start Free Assessment →
                </Link>
              ) : (
                <button disabled className="w-full py-2.5 rounded-xl bg-[#CBD5E1] text-[#475569] font-sans font-medium cursor-not-allowed">
                  Coming soon
                </button>
              )}
            </div>
          )}

          {/* Paid Pack Cards */}
          {filter !== "Free" && course.packs.map((pack: any, idx: number) => (
            <div key={pack._id || idx} className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] shadow-sm rounded-2xl p-6 flex flex-col min-h-[300px] shrink-0 w-[320px] snap-start hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${color.bgTint} flex items-center justify-center ${color.text}`}>
                  <SubjectIcon size={24} />
                </div>
                <span className="bg-[#F1F5F9] text-[#64748B] text-xs font-medium rounded-md px-2 py-0.5">CORE</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2">{pack.title}</h3>
              <p className="text-[#64748B] font-sans text-sm line-clamp-2 min-h-[40px] mb-4">{pack.description}</p>
              <div className="border-t border-[#E2E8F0] my-4"></div>
              <div className="mb-6 flex-grow">
                <div className="text-[#0F172A] font-semibold text-lg">
                  ₹{(pack.price || 0).toLocaleString("en-IN")}
                </div>
                <ul className="flex flex-col gap-2.5 mt-4">
                  {(pack.points || []).map((pt: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="text-[#334155] font-sans text-sm leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleAddToCart(course, pack)}
                disabled={isInCart(`${course._id}-${pack._id}`)}
                className={`mt-auto w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isInCart(`${course._id}-${pack._id}`)
                    ? "bg-[#E5E7EB] text-[#475569] cursor-not-allowed"
                    : "bg-[#6366F1] text-white hover:bg-indigo-600"
                }`}>
                {isInCart(`${course._id}-${pack._id}`) ? "Added to Cart" : "Add to Cart"}
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
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
            <span className="font-fraunces font-bold not-italic text-[#0F172A]">Explore Our Test{' '}</span>
            <br className="md:hidden" />
            <span className="font-fraunces font-bold italic text-[#6366F1]">Series</span>
          </h1>
          <p className="text-[#334155] text-lg font-sans leading-relaxed">
            Comprehensive, curriculum-aligned test bundles designed to strengthen Maths, Reasoning, and English through structured practice, timed assessments, and measurable progress.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-xl font-sans font-medium transition-colors ${
                filter === tab ? "bg-[#6366F1] text-white" : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {toastMessage ? (
          <div className="mx-auto mb-8 max-w-3xl rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium">
            {toastMessage}
          </div>
        ) : null}

        <div>
          {subjects.length === 0 ? (
            <div className="text-center text-[#64748B] py-20">Loading courses...</div>
          ) : (
            subjects.map((subject) => renderSubject(subject))
          )}
        </div>
      </div>
    </div>
  );
}




