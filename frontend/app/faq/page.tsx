import FAQAccordion from "@/components/FAQAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | EduCraft",
  description: "Frequently asked questions and support.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-[80px] bg-[--background]">
      {/* Hero */}
      <div className="h-[220px] md:h-[300px] flex items-center justify-center bg-[--alt-bg] border-b border-[--accent]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[--primary] animate-[fade-in-up_0.5s_ease-out]">
          Frequently Asked Questions
        </h1>
      </div>
      <FAQAccordion />
    </div>
  );
}
