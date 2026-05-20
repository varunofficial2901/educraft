"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Column 1: Logo & Desc */}
          <div className="flex flex-col gap-4 pr-4">
            <Link href="/" className="font-serif font-bold text-[#0F172A] text-3xl focus:outline-none tracking-tight">
              EduCraft
            </Link>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Helping students build confidence through structured practice, one test at a time.
            </p>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Aligned with Australian curriculum standards.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-[#0F172A] text-lg">PLATFORM</h4>
            <div className="flex flex-col gap-3 text-sm text-[#64748B]">
              <Link href="/courses" className="hover:text-[#6366F1] transition-colors">Test Series</Link>
              <Link href="/courses?filter=FREE" className="hover:text-[#6366F1] transition-colors">Free Practice Test</Link>
              <Link href="/#how-it-works" className="hover:text-[#6366F1] transition-colors">How It Works</Link>
              <Link href="/#about" className="hover:text-[#6366F1] transition-colors">About Us</Link>
            </div>
          </div>

          {/* Column 3: Support Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-[#0F172A] text-lg">SUPPORT</h4>
            <div className="flex flex-col gap-3 text-sm text-[#64748B]">
              <Link href="/contact" className="hover:text-[#6366F1] transition-colors">Contact Us</Link>
              <Link href="/faq" className="hover:text-[#6366F1] transition-colors">Frequently Asked Questions</Link>
              <Link href="/privacy-policy" className="hover:text-[#6366F1] transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#6366F1] transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-[#6366F1] transition-colors">Refund Policy</Link>
            </div>
          </div>

          {/* Column 4: Email Subscription */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-[#0F172A] text-lg">Get Updates on New Tests</h4>
            <p className="font-sans text-sm text-[#64748B] leading-relaxed">
              Be the first to know when new test bundles and practice sets are added.
            </p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="w-full rounded-l-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#6366F1] transition-colors"
              />
              <motion.button
                whileTap={{ scale: [1, 1.08, 1], transition: { duration: 0.18 } }}
                type="submit"
                className="bg-[#6366F1] text-white rounded-r-full px-5 py-2.5 text-sm font-medium hover:bg-indigo-600 transition-colors whitespace-nowrap"
              >
                Notify Me
              </motion.button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E2E8F0] flex justify-center text-sm text-[#64748B]">
          <span>© 2026 EduCraft Inc. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
}
