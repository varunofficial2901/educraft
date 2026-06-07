import FAQAccordion from "@/components/FAQAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | EduCraft",
  description: "Frequently asked questions and support.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-16 text-center">
          Frequently Asked Questions
        </h1>

        <FAQAccordion />
        
      </div>
    </div>
  );
}
