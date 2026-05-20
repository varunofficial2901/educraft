"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  { id: 1, category: "Courses", question: "How long do I have access to a course?", answer: "Once enrolled, you have complete lifetime access to the course materials, including any future updates we make." },
  { id: 2, category: "General", question: "Do you offer certificates?", answer: "Yes, upon completion of any premium course, you receive a verified, shareable digital certificate that you can add to your LinkedIn profile." },
  { id: 3, category: "Billing", question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and Apple Pay processing globally." },
  { id: 4, category: "Technical", question: "Can I download videos for offline viewing?", answer: "Yes, our mobile application allows downloading content for offline access when you are traveling." },
  { id: 5, category: "Courses", question: "Are there prerequisites?", answer: "Most beginner courses have no prerequisites. Advanced courses clearly outline their prerequisites on their landing page." },
  { id: 6, category: "General", question: "Is there a refund policy?", answer: "We offer a 30-day money-back guarantee, no questions asked, if you are not satisfied with your experience." },
  { id: 7, category: "Billing", question: "How do subscriptions work?", answer: "Subscriptions are billed either monthly or annually, giving you unrestricted access to our entire course library." },
  { id: 8, category: "Technical", question: "I forgot my password, what do I do?", answer: "Click 'Forgot Password' on the login screen, enter your email, and we will send you a secure reset link." },
];

const CATEGORIES = ["All", "General", "Courses", "Billing", "Technical"];

export default function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = FAQS.filter(faq => {
    return activeCategory === "All" || faq.category === activeCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      
      {/* Tabs Filter Bar */}
      <div className="mb-14">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-sans font-medium transition-colors",
                activeCategory === cat 
                  ? "bg-[#6366F1] text-white" 
                  : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List (Flat Layout) */}
      <div className="space-y-0">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-[#64748B] py-10 font-sans"
            >
              No FAQs found matching your criteria.
            </motion.p>
          ) : (
            filteredFaqs.map((faq) => (
              <motion.div 
                key={faq.id} 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-6 border-b border-[#E2E8F0] last:border-b-0"
              >
                <h3 className="font-serif font-semibold text-xl text-[#0F172A] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#334155] leading-relaxed font-sans text-sm">
                  {faq.answer}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-20 text-center"
      >
        <div className="inline-flex flex-col items-center p-10 bg-[#F1F5F9] rounded-3xl border border-[#E2E8F0] shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-3">Still can't find the answer?</h3>
          <p className="text-[#334155] mb-8 font-sans font-medium">Our support team is ready to assist you.</p>
          <a href="/contact" className="px-8 py-3.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            Contact Support
          </a>
        </div>
      </motion.div>
    </div>
  );
}
