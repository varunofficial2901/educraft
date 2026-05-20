import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EduCraft",
  description: "Privacy policy and data protection guidelines for EduCraft.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl bg-white p-8 md:p-12 rounded-2xl border border-[#E2E8F0] shadow-sm">
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-10 text-center border-b border-[#E2E8F0] pb-6">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">1. Introduction</h2>
            <p>
              Welcome to EduCraft. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">2. Data Collection</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Technical Data, Profile Data, and Usage Data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">3. Data Usage</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you; Where it is necessary for our legitimate interests; Where we need to comply with a legal obligation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">4. Data Protection</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">5. Cookies</h2>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">6. User Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and to automated decision making.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">7. Contact</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at our provided support email or physical address.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
