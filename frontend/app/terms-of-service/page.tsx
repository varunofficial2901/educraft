import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EduCraft",
  description: "Terms of service and use licenses for EduCraft.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl bg-white p-8 md:p-12 rounded-2xl border border-[#E2E8F0] shadow-sm">
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-10 text-center border-b border-[#E2E8F0] pb-6">
          Terms of Service
        </h1>
        
        <div className="space-y-8 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">1. Acceptance</h2>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use EduCraft if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on EduCraft's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">3. Disclaimer</h2>
            <p>
              The materials on EduCraft's website are provided on an 'as is' basis. EduCraft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall EduCraft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EduCraft's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">6. Contact</h2>
            <p>
              For any questions regarding our Terms of Service, please reach out via our contact page.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
