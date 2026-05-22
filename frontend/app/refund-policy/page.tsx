import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | EduCraft",
  description: "Read the refund policy for EduCraft's test bundles and assessment services.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl bg-white p-8 md:p-12 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#6366F1] font-semibold mb-3">
            Refund Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">
            Easy, transparent refund terms
          </h1>
          <p className="max-w-2xl mx-auto text-[#475569] leading-relaxed text-base md:text-lg">
            We want every family to feel confident in their EduCraft purchase. If you are not satisfied, our policy is simple and supportive.
          </p>
        </div>

        <div className="space-y-10 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              30-Day Money-Back Guarantee
            </h2>
            <p>
              If you decide the course bundle or assessment does not meet your expectations, you may request a full refund within 30 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              How to request a refund
            </h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>Contact us through the Contact page or the email address provided on the site.</li>
              <li>Include your order reference and the reason for your request.</li>
              <li>We will review your request and confirm next steps within 2 business days.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              Conditions and support
            </h2>
            <p>
              Refunds are intended for users who have not benefited from the course and are available for eligible purchases within the specified period. We are happy to offer extra support and guidance before processing a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
              Contact us
            </h2>
            <p>
              If you have any questions about this refund policy or need help with a refund request, please visit our Contact page or email our support team directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
