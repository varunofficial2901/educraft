"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const JOURNEY_IMAGE = "/2.jpeg";

const STEPS = [
  {
    title: "Take a Free Assessment",
    description: "Identify strengths and areas for improvement with our comprehensive initial test."
  },
  {
    title: "Targeted Practice",
    description: "Engage with curriculum-aligned exercises designed to build core skills."
  },
  {
    title: "Track Measurable Progress",
    description: "Review detailed insights and watch your child's confidence grow over time."
  }
];

export default function SuccessJourney() {
  return (
    <section className="py-24 relative bg-white border-t border-[#E2E8F0]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2 h-[500px] relative rounded-2xl overflow-hidden shrink-0 shadow-lg">
            <Image 
              src={JOURNEY_IMAGE}
              alt="Child's learning journey"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] leading-tight mb-6">
              Your Child's Success Journey
            </h2>
            <p className="text-[#334155] text-lg font-sans leading-relaxed mb-10">
              Comprehensive test series designed to build confidence through consistent
              practice, timed tests, and clear performance insights — helping students master core
              subjects and achieve academic excellence.
            </p>

            <div className="flex flex-col gap-8">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="mt-1 text-[#6366F1] bg-[#EEF2FF] rounded-full p-1 transition-colors group-hover:bg-[#6366F1] group-hover:text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#334155] font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
