"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Lock, Loader2, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Test {
  _id: string;
  title: string;
  duration: number;
  is_free: boolean;
  question_count: number;
}

interface Subject {
  _id: string;
  name: string;
  color: string;
  bundle_id: string;
}

export default function SubjectTestsPage({ params }: { params: any }) {
  const resolvedParams = use<{ bundleId: string; subject: string }>(params);
  const bundleId  = resolvedParams.bundleId;
  const subjectId = resolvedParams.subject;

  const [subject, setSubject]         = useState<Subject | null>(null);
  const [tests, setTests]             = useState<Test[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [bundleTitle, setBundleTitle] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('edu_purchased_bundles');
      try {
        const list = stored ? JSON.parse(stored) : [];
        setIsPurchased(list.some((item: any) => item.id === bundleId));
      } catch (e) {}
    }
  }, [bundleId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get bundle title
        const bundleRes = await fetch(`${API_URL}/api/public/bundles/${bundleId}`);
        if (bundleRes.ok) {
          const bundleJson = await bundleRes.json();
          setBundleTitle(bundleJson.data?.title || '');
        }

        // Get this subject's info (name, color) from the bundle's subjects list
        const subjectsRes = await fetch(`${API_URL}/api/public/bundles/${bundleId}/subjects`);
        if (subjectsRes.ok) {
          const subjectsJson = await subjectsRes.json();
          const found = subjectsJson.data?.find((s: Subject) => s._id === subjectId);
          if (found) setSubject(found);
        }

        // Get tests for this specific subject
        const testsRes = await fetch(`${API_URL}/api/public/subjects/${subjectId}/tests`);
        if (testsRes.ok) {
          const testsJson = await testsRes.json();
          setTests(testsJson.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bundleId, subjectId]);

  const handleStartTest = (e: React.MouseEvent, isFree: boolean) => {
    if (!isFree && !isPurchased) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6366F1]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl font-sans">

        {/* Back Link */}
        <Link href={`/bundles/${bundleId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:underline mb-6">
          <ArrowLeft size={16} /> Back to {bundleTitle || 'Bundle'}
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 mb-10 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                style={{ background: subject?.color || '#6366F1' }}>
                {subject?.name?.[0] || '?'}
              </div>
              <div>
                <p className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">{bundleTitle}</p>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mt-1">
                  {subject?.name || 'Subject'} Tests
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  {tests.length} test{tests.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <div className="shrink-0 font-semibold text-sm bg-indigo-50 text-[#6366F1] px-4 py-2 rounded-2xl">
              {tests.length} Papers Available
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-[#EEF2FF] border border-[#CBD5E1] p-5 text-sm text-slate-700">
            <p className="font-semibold mb-2">Curriculum Note</p>
            <p>These tests are strongly aligned with the NSW curriculum and designed to support structured practice for selective exam preparation and academic growth.</p>
          </div>
        </div>

        {/* Tests List */}
        {tests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No tests available yet.</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {tests.map((test, idx) => (
              <div key={test._id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-gray-900">{test.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                      <span>Duration: {test.duration} min</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>Questions: {test.question_count}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      {test.is_free ? (
                        <span className="text-[#16A34A] font-semibold">Free</span>
                      ) : (
                        <span className="text-[#6366F1] font-semibold flex items-center gap-0.5">
                          <CheckCircle size={12} /> Ready to start
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  <Link
                    href={`/quiz/${test._id}/instructions`}
                    onClick={(e) => handleStartTest(e, test.is_free)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    Start Test <Play size={14} fill="white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-[#6366F1] rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock size={32} />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#0F172A] mb-2">Unlock This Test</h3>
            <p className="text-[#334155] text-sm mb-6 leading-relaxed">
              Purchase the <span className="font-bold text-[#6366F1]">{bundleTitle}</span> to access this test.
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/bundles/${bundleId}`}
                className="w-full py-3 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-2xl text-sm font-semibold transition-colors inline-block">
                View Bundle Details
              </Link>
              <button onClick={() => setShowModal(false)}
                className="w-full py-3 border border-gray-300 text-[#334155] rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








// "use client";

// import React, { use, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { CheckCircle2, Shield, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useCart } from "@/components/CartContext";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface BackendTest {
//   _id: string;
//   title: string;
//   subject_id: string;
//   duration: number;
//   is_free: boolean;
//   question_count: number;
// }

// interface BackendSubject {
//   _id: string;
//   name: string;
//   color: string;
//   icon: string;
//   test_count: number;
//   tests?: BackendTest[];
// }

// interface BackendBundle {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   is_free: boolean;
//   points: string[];
//   tests: BackendTest[];
// }

// export default function SubjectTestsPage({ params }: { params: any }) {
//   const resolvedParams = use<{ bundleId: string; subjectId: string }>(params);
//   const bundleId   = resolvedParams.bundleId;
//   const subjectId  = resolvedParams.subjectId;
//   const router = useRouter();
//   const { addToCart, isInCart }   = useCart();
//   const [toastMessage, setToastMessage] = useState("");
//   const [bundle, setBundle]       = useState<BackendBundle | null>(null);
//   const [subjects, setSubjects]   = useState<BackendSubject[]>([]);
//   const [loading, setLoading]     = useState(true);
//   const [notFound, setNotFound]   = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Bundle fetch
//         const bundleRes = await fetch(`${API_URL}/api/public/bundles/${bundleId}`);
//         if (!bundleRes.ok) { setNotFound(true); return; }
//         const bundleJson = await bundleRes.json();
//         setBundle(bundleJson.data);

//         // Subjects fetch
//         const subjectsRes = await fetch(`${API_URL}/api/public/bundles/${bundleId}/subjects`);
//         if (subjectsRes.ok) {
//           const subjectsJson = await subjectsRes.json();
//           setSubjects(subjectsJson.data || []);
//         }
//       } catch (err) {
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [bundleId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-[120px] flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#6366F1]" size={32} />
//       </div>
//     );
//   }

//   if (notFound || !bundle) {
//     return (
//       <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
//         <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Bundle Not Found</h1>
//         <p className="text-gray-500 mb-6">The bundle page you are looking for does not exist.</p>
//         <Link href="/courses" className="px-6 py-3 bg-[#6366F1] text-white rounded-xl font-semibold">
//           Back to Test Series
//         </Link>
//       </div>
//     );
//   }

//   const handleAdd = () => {
//     addToCart({ id: bundle._id, title: bundle.title, subtitle: bundle.description, price: bundle.price, subject: "Test Bundle" });
//     setToastMessage(`${bundle.title} added to cart.`);
//     window.setTimeout(() => setToastMessage(""), 2800);
//   };

//   const handleCheckout = () => {
//     if (!isInCart(bundle._id)) {
//       addToCart({ id: bundle._id, title: bundle.title, subtitle: bundle.description, price: bundle.price, subject: "Test Bundle" });
//     }
//     router.push("/cart");
//   };

//   const PurchaseCard = ({ isMobile }: { isMobile?: boolean }) => {
//     const inCart = isInCart(bundle._id);
//     return (
//       <div className={`bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 shadow-sm ${!isMobile ? "sticky top-[120px]" : "mb-8"}`}>
//         <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2">{bundle.title}</h3>
//         <div className="flex items-baseline gap-1.5 mb-6 text-gray-900 dark:text-white">
//           <span className="text-4xl font-bold font-serif">{bundle.is_free ? 'Free' : `$${bundle.price}`}</span>
//         </div>
//         <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-300 font-sans">
//           <div className="flex justify-between border-b border-gray-100 pb-2">
//             <span>Subjects</span>
//             <span className="font-semibold">{subjects.length}</span>
//           </div>
//           <div className="flex justify-between border-b border-gray-100 pb-2">
//             <span>Total Tests</span>
//             <span className="font-semibold">{subjects.reduce((a, s) => a + s.test_count, 0)}</span>
//           </div>
//         </div>
//         {!bundle.is_free && (
//           <div className="flex flex-col gap-3">
//             <button onClick={handleAdd} disabled={inCart}
//               className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors cursor-pointer ${inCart ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#6366F1] text-white hover:bg-indigo-600"}`}>
//               {inCart ? "Added to Cart" : "Add to Cart"}
//             </button>
//             <button onClick={handleCheckout}
//               className="w-full py-3.5 rounded-2xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
//       <div className="container mx-auto px-4 md:px-8 max-w-7xl">
//         <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:underline mb-6 font-sans">
//           <ArrowLeft size={16} /> Back to Test Series
//         </Link>

//         {toastMessage && (
//           <div className="mb-6 rounded-3xl border border-[#D1FAE5] bg-[#ECFDF5] px-6 py-4 text-sm text-[#166534] font-medium text-center shadow-sm font-sans">
//             {toastMessage}
//           </div>
//         )}

//         {/* Bundle Header */}
//         <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 shadow-sm border border-[#E2E8F0] relative overflow-hidden">
//           <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#C7D2FE] opacity-30 blur-2xl pointer-events-none" />
//           <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-[#FCE7F3] opacity-40 blur-2xl pointer-events-none" />
//           <div className="relative z-10 max-w-3xl">
//             <span className="text-xs uppercase font-bold tracking-widest text-[#6366F1] bg-[#EEF2FF] px-3 py-1.5 rounded-full">
//               {bundle.title.toUpperCase()}
//             </span>
//             <h1 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-3 text-slate-950">{bundle.title}</h1>
//             <p className="text-slate-600 font-sans text-base md:text-lg mb-8 leading-relaxed">{bundle.description}</p>
//             <div className="grid gap-4 sm:grid-cols-3 text-sm">
//               <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
//                 <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Price</p>
//                 <p className="text-2xl font-bold font-serif mt-2 text-slate-950">{bundle.is_free ? 'Free' : `$${bundle.price}`}</p>
//               </div>
//               <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
//                 <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Subjects</p>
//                 <p className="text-2xl font-bold font-serif mt-2 text-slate-950">{subjects.length}</p>
//               </div>
//               <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
//                 <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em]">Total Tests</p>
//                 <p className="text-2xl font-bold font-serif mt-2 text-slate-950">
//                   {subjects.reduce((a, s) => a + s.test_count, 0)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           <div className="lg:col-span-2 space-y-8 font-sans">

//             {/* Mobile Purchase Card */}
//             <div className="lg:hidden block"><PurchaseCard isMobile={true} /></div>

//             {/* Subjects Section */}
//             {subjects.length > 0 && (
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white px-2">
//                   Subjects Included
//                 </h2>
//                 <div className="flex flex-col gap-4">
//                   {subjects.map((subject) => (
//                    <Link key={subject._id}
//                    href={`/bundles/${bundleId}/${subject._id}`}
//                       className="group bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 shadow-sm">
//                       <div className="flex items-start sm:items-center justify-between gap-4">
//                         <div className="flex items-start sm:items-center gap-4">
//                           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
//                             style={{ background: subject.color || '#6366F1' }}>
//                             {subject.name[0]}
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-serif font-bold text-[#0F172A] dark:text-white">
//                               {subject.name}
//                             </h3>
//                             <p className="text-[#64748B] font-sans text-xs mt-1">
//                               {subject.test_count} test{subject.test_count !== 1 ? 's' : ''} available
//                             </p>
//                           </div>
//                         </div>
//                         <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-xl shrink-0">
//                           {subject.test_count} Tests →
//                         </span>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Bundle Benefits */}
//             {bundle.points.length > 0 && (
//               <div className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm">
//                 <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
//                   What You Get With This Bundle
//                 </h2>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {bundle.points.map((point, index) => (
//                     <li key={index} className="flex items-start gap-3">
//                       <CheckCircle2 size={20} className="text-[#16A34A] shrink-0 mt-0.5" />
//                       <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{point}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Test Info */}
//             <div className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm">
//               <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">Test Taking Information</h2>
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-indigo-50 text-[#6366F1] rounded-xl shrink-0"><Shield size={24} /></div>
//                 <div>
//                   <h4 className="font-serif font-bold text-base text-gray-900 dark:text-white mb-1">Exam-style Simulation Mode</h4>
//                   <p className="text-gray-500 text-sm leading-relaxed">
//                     All tests feature timed sessions and detailed review reports. Students can resume tests anytime from localStorage if they navigate away during practice.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Desktop Purchase Card */}
//           <div className="hidden lg:block relative h-full">
//             <PurchaseCard isMobile={false} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
