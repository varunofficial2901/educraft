"use client";

import { BookOpen, Clock, FileText, BarChart2 } from "lucide-react";

export default function SloganSection() {
  return (
    <section className="py-24 relative bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0F172A] mb-4">
            Why Parents Trust EduAid
          </h2>
          <p className="text-[#334155] text-lg font-sans max-w-2xl mx-auto">
            We provide the structured environment your child needs to succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-start text-left">
            <div className="w-full h-40 relative">
              <img src="/1.jpeg" alt="Curriculum Aligned" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-5 flex-grow flex flex-col items-start">
              <div className="mb-4 text-[#6366F1] bg-[#6366F1]/10 p-3 rounded-xl inline-block">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-3">Curriculum Aligned</h3>
              <p className="text-[#334155] font-sans text-sm leading-relaxed">
                Matches what your child learns at school
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-start text-left">
            <div className="w-full h-40 relative">
              <img src="/2.jpeg" alt="Timed Practice" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-5 flex-grow flex flex-col items-start">
              <div className="mb-4 text-[#6366F1] bg-[#6366F1]/10 p-3 rounded-xl inline-block">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-3">Timed Practice</h3>
              <p className="text-[#334155] font-sans text-sm leading-relaxed">
                Helps build confidence for real exam conditions
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-start text-left">
            <div className="w-full h-40 relative">
              <img src="/3.jpeg" alt="Exam-Style Mock Tests" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-5 flex-grow flex flex-col items-start">
              <div className="mb-4 text-[#6366F1] bg-[#6366F1]/10 p-3 rounded-xl inline-block">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-3">Exam-Style Mock Tests</h3>
              <p className="text-[#334155] font-sans text-sm leading-relaxed">
                Practice with tests designed to feel like real exams
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-start text-left">
            <div className="w-full h-40 relative">
              <img src="/4.jpeg" alt="Detailed Performance Insights" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 pt-5 flex-grow flex flex-col items-start">
              <div className="mb-4 text-[#6366F1] bg-[#6366F1]/10 p-3 rounded-xl inline-block">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-3">Detailed Performance Insights</h3>
              <p className="text-[#334155] font-sans text-sm leading-relaxed">
                Get clear solutions and understand where your child needs improvement
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
