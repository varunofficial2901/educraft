import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | EduCraft",
  description: "Learn more about EduCraft's mission, teaching philosophy, and support for students.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#6366F1] font-semibold mb-3">
            About EduCraft
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">
            Building confidence through smarter test practice
          </h1>
          <p className="max-w-2xl mx-auto text-[#475569] leading-relaxed text-base md:text-lg">
            EduCraft helps students prepare for school entry and selective exams with expert-designed test bundles, insightful progress analytics, and clear review pathways.
          </p>
        </div>

        <div className="space-y-10 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              Our mission
            </h2>
            <p>
              We believe every learner deserves a structured, low-stress pathway to academic confidence. Our assessments are designed to identify strengths, highlight improvement areas, and give students practical practice in the exact reasoning and literacy skills that matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              What we offer
            </h2>
            <ul className="grid gap-4 md:grid-cols-2">
              <li className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                <p className="font-semibold text-[#0F172A] mb-2">Practice with purpose</p>
                <p>Realistic question sets with immediate scoring and review help students improve faster.</p>
              </li>
              <li className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                <p className="font-semibold text-[#0F172A] mb-2">Clear progress insights</p>
                <p>Actionable analytics show strengths by topic and difficulty so learners can focus where it matters.</p>
              </li>
              <li className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                <p className="font-semibold text-[#0F172A] mb-2">Flexible, self-paced learning</p>
                <p>Students can take assessments on their schedule and review their results anytime.</p>
              </li>
              <li className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                <p className="font-semibold text-[#0F172A] mb-2">Trusted support</p>
                <p>We provide clear guidance and responsive help for families and educators.</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              Why families choose EduCraft
            </h2>
            <p>
              We create easy-to-use tools that help students stay calm under timed conditions, learn from each attempt, and improve their reasoning skills in a measurable way.
            </p>
            <p>
              Every bundle is crafted to mirror exam-style challenges while keeping the experience supportive, clear, and focused on progress.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
