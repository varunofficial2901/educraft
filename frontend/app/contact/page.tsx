import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | EduCraft",
  description: "Get in touch with the EduCraft team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section */}
        <div className="text-center mb-16">
          <span className="font-inter text-xs font-semibold tracking-widest text-[#6366F1] uppercase block mb-3">
            CONTACT US
          </span>
          <h1 className="text-5xl md:text-6xl mb-6 text-center">
            <span className="font-fraunces font-bold not-italic text-[#0F172A]">
              Get In{' '}
            </span>
            <span className="font-fraunces font-bold italic text-[#6366F1]">
              Touch
            </span>
          </h1>
          <p className="font-inter text-[#64748B] max-w-lg mx-auto">
            Have a question about our test series, your child's progress, or how to get started? We're here to help.
          </p>
        </div>

        {/* Main Body */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Left Column */}
          <div className="w-full md:w-[45%] flex flex-col">
            <h2 className="font-fraunces font-bold text-3xl md:text-4xl text-[#0F172A] leading-tight mb-4">
              We'd love to<br />hear from you
            </h2>
            <p className="font-inter text-sm text-[#64748B] max-w-xs mb-6">
              Whether you have a question about our curriculum, want to know which test bundle suits your child best, or need help with your account — our team is ready to support you.
            </p>

            <div className="border-b border-[#E2E8F0] mb-6"></div>

            {/* Info Block 1 */}
            <div className="mb-5">
              <span className="font-inter text-xs text-[#64748B] block mb-1">Email us at:</span>
              <span className="font-inter font-bold text-[#0F172A] text-base block mb-1">support@educraft.com</span>
              <span className="font-inter text-xs text-[#64748B] block">We aim to respond within one business day.</span>
            </div>

            {/* Info Block 2 */}
            <div className="mb-5">
              <span className="font-inter text-xs text-[#64748B] block mb-1">Support hours:</span>
              <span className="font-inter font-bold text-[#0F172A] text-base block mb-1">Mon – Sun, 8 AM – 8 PM AEST</span>
              <span className="font-inter text-xs text-[#64748B] block">Our team is available seven days a week to assist you.</span>
            </div>

            {/* Info Block 3 */}
            <div>
              <span className="font-inter text-xs text-[#64748B] block mb-1">For parents:</span>
              <span className="font-inter font-bold text-[#0F172A] text-base block mb-1">Personalised guidance, anytime</span>
              <span className="font-inter text-xs text-[#64748B] block">Tell us your child's goals and we'll recommend the right path.</span>
            </div>
          </div>

          {/* Right Column: Form Side */}
          <div className="w-full md:w-[55%] flex flex-col justify-end">
            <ContactForm />
          </div>
          
        </div>
      </div>
    </div>
  );
}
