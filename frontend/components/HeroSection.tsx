"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "/1.jpeg";

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.getElementById('courses');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Image (40-45%) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-[45%] h-[500px] md:h-[650px] relative rounded-2xl overflow-hidden shrink-0"
          >
            <Image 
              src={HERO_IMAGE}
              alt="Children studying"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </motion.div>

          {/* Right Side: Text (55-60%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="w-full md:w-[55%] flex flex-col items-start"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-8">
              <Shield size={16} className="text-[#64748B]" />
              <span className="text-[#64748B] text-sm font-medium">
                Aligned with Australian Curriculum
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl mb-6 leading-[1.1]">
              <span className="font-fraunces font-bold not-italic text-[#0F172A]">
                Help Your Child Build Academic{' '}
              </span>
              <br className="hidden md:block" />
              <span className="font-fraunces font-bold italic text-[#6366F1]">
                Confidence
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-[#334155] text-lg font-sans max-w-lg mb-10 leading-relaxed">
              Personalised assessments, targeted practice, and measurable progress tracking
              to strengthen Maths, Reasoning and Reading skills.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/courses?filter=FREE"
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
