import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EduCraft",
  description: "Privacy policy and data protection guidelines for EduCraft.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#E2E8F0] p-10 md:p-14">
          <div className="text-center mb-12">
            {/* <p className="text-sm uppercase tracking-[0.4em] text-[#6366F1] font-semibold mb-4"> */}
              {/* Privacy Policy */}
            {/* </p> */}
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#0F172A] mb-4">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
              We respect your privacy and are committed to protecting your personal information while you use EduCraft.
            </p>
          </div>

          <div className="space-y-10 text-[#334155] leading-relaxed">
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">1. Introduction</h2>
              <p>
                [Company Name] (ABN: [Insert ABN]) is an Australian-registered business providing online educational
                assessments and learning resources. We are committed to protecting the privacy of all users in
                accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              </p>
              <p className="mt-3">
                This policy explains what personal information we collect, why we collect it, how we use it, and your
                rights regarding that information. It applies to all users of our platform, including visitors,
                registered users, and purchasers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Password (stored in encrypted form)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">Learning &amp; Usage Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Tests attempted and completed</li>
                <li>Test scores and results</li>
                <li>Progress and performance data</li>
                <li>Time spent on assessments</li>
                <li>Learning activity and history</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">Technical Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Device type and operating system</li>
                <li>Browser type and version</li>
                <li>IP address</li>
                <li>Login activity and timestamps</li>
                <li>Security logs</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">Cookies</h3>
              <p>
                Our platform uses cookies to manage user sessions, remember login state, and support core platform
                functionality. Cookies are small text files stored on your device. You may disable cookies through
                your browser settings, however doing so may affect the functionality of the platform.
              </p>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">Payment Information</h3>
              <p>
                We do not store credit card or payment details directly. Payments are processed by a third-party
                payment processor. Please refer to your payment processor&apos;s privacy policy for details on how
                your payment information is handled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create and manage your user account</li>
                <li>Provide access to purchased bundles and educational content</li>
                <li>Deliver assessments and generate progress reports</li>
                <li>Send account-related communications (e.g. registration confirmation, password reset)</li>
                <li>Send product updates and platform announcements</li>
                <li>
                  Send marketing communications — you may opt out at any time via the unsubscribe link in any email
                </li>
                <li>Improve platform performance and user experience</li>
                <li>Detect, investigate, and prevent fraud or unauthorised access</li>
                <li>Comply with legal obligations under Australian law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">4. Cookies</h2>
              <p className="mb-3">We use the following types of cookies on our platform:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Session cookies</strong> — keep you logged in while you use the platform. These are deleted
                  when you close your browser.
                </li>
                <li>
                  <strong>Functional cookies</strong> — remember your preferences and settings to improve your
                  experience.
                </li>
              </ul>
              <p className="mt-3">
                We do not use advertising or third-party tracking cookies. You can control cookie settings through
                your browser, but disabling cookies may prevent certain features of the platform from working
                correctly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">5. Data Security</h2>
              <p className="mb-3">
                We take reasonable steps to protect your personal information from misuse, interference, loss, and
                unauthorised access. Our security measures include:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Secure and encrypted data transmission (HTTPS)</li>
                <li>Encrypted storage of passwords</li>
                <li>Access controls limiting who can view user data</li>
                <li>Security monitoring and login activity logging</li>
              </ul>
              <p className="mt-3">
                While we take these precautions, no method of transmission over the internet is completely secure. We
                encourage users to choose strong passwords and keep their login credentials confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide our
                services.
              </p>
              <p className="mt-3">
                If you request account deletion, your personal data will be permanently removed from our systems
                within 30 days of the request. During this 30-day period your account will be deactivated and
                inaccessible.
              </p>
              <p className="mt-3">
                We may retain certain information beyond this period if required to do so by Australian law or for
                the purposes of resolving disputes and enforcing our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">7. Information Sharing</h2>
              <p className="mb-3">
                We do not sell, rent, or trade your personal information to third parties. Your information may only
                be shared in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  With payment processors to facilitate purchases — only the minimum information necessary is shared
                </li>
                <li>
                  With service providers engaged to operate the platform, who are bound by confidentiality
                  obligations
                </li>
                <li>When required by Australian law, a court order, or a government authority</li>
                <li>To protect the legal rights, safety, and security of our platform and users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">8. Children and Minors</h2>
              <p>
                Our platform is accessible to users of all ages, including school-aged students under 18. We are
                committed to protecting the privacy of younger users.
              </p>
              <p className="mt-3">
                Users under the age of 18 should have a parent or guardian review this Privacy Policy. By allowing a
                minor to use the platform, the parent or guardian consents to the collection and use of that
                minor&apos;s information as described in this policy.
              </p>
              <p className="mt-3">
                We do not knowingly collect more information from minors than is necessary to provide the educational
                service. Parents or guardians may contact us at any time to access, correct, or request deletion of
                their child&apos;s personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">9. Your Rights</h2>
              <p className="mb-3">
                Under the Australian Privacy Principles, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request corrections to inaccurate or outdated information</li>
                <li>Request deletion of your account and personal data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Lodge a complaint if you believe your privacy rights have been breached</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us using the details on our Contact Us page. We will
                respond to all requests within a reasonable timeframe and no later than 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">
                10. Anti-Piracy &amp; Content Protection
              </h2>
              <p className="mb-3">
                To protect our educational content, we actively monitor platform activity for:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Unauthorised account sharing</li>
                <li>Suspicious or unusual login activity</li>
                <li>Attempts to copy, record, reproduce, or distribute platform content</li>
              </ul>
              <p className="mt-3">
                Purchasing access to our platform does not transfer ownership of any content. All assessments,
                questions, explanations, designs, and educational materials remain the exclusive property of [Company
                Name].
              </p>
              <p className="mt-3">
                Users may not resell, redistribute, publicly share, or create commercial copies of any content
                accessed through the platform. Violations may result in immediate account suspension and legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">11. Bundle Access &amp; Expiry</h2>
              <p>
                Purchasing a bundle grants you access to the associated content for the duration specified at the
                time of purchase.
              </p>
              <p className="mt-3 mb-2">Once the access period expires:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content associated with that bundle may become unavailable</li>
                <li>Continued access requires a new purchase</li>
              </ul>
              <p className="mt-3">
                We do not offer automatic renewals without prior notice. Access durations are clearly displayed
                before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">12. Intellectual Property</h2>
              <p>
                All content on this platform — including but not limited to assessments, questions, answers,
                explanations, graphics, designs, and educational materials — is the exclusive intellectual property
                of [Company Name] and is protected under Australian copyright law.
              </p>
              <p className="mt-3 mb-2">
                Users are granted a limited, non-transferable, personal licence to access content for their own
                educational use only. This licence does not permit:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reselling or commercialising any content</li>
                <li>Redistributing content to others</li>
                <li>Sharing content publicly in any format</li>
                <li>Creating derivative works based on platform content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">13. Data Storage Location</h2>
              <p>
                All user data collected through this platform is stored on servers located within Australia. We do
                not transfer personal information to overseas recipients unless required by law or explicitly
                consented to by the user.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">14. Privacy Complaints</h2>
              <p className="mb-4">
                If you believe we have breached your privacy or not handled your personal information in accordance
                with the Australian Privacy Principles, you have the right to make a complaint.
              </p>

              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Step 1 — Contact us directly
              </h3>
              <p className="mb-4">
                Please reach out to us first using the contact details on our Contact Us page. We take all privacy
                complaints seriously and will investigate and respond within 30 days.
              </p>

              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Step 2 — Office of the Australian Information Commissioner (OAIC)
              </h3>
              <p className="mb-2">
                If you are not satisfied with our response, or if we fail to respond within 30 days, you may
                escalate your complaint to the OAIC:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Website:{" "}
                  <a href="https://www.oaic.gov.au" className="text-[#6366F1] underline">
                    www.oaic.gov.au
                  </a>
                </li>
                <li>Phone: 1300 363 992</li>
                <li>Post: GPO Box 5218, Sydney NSW 2001</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">15. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal
                obligations. When we make material changes, we will notify registered users by email or by displaying
                a prominent notice on the platform.
              </p>
              <p className="mt-3">
                The updated policy will take effect from the date shown at the top of this document. Continued use
                of the platform after that date constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">16. Contact Us</h2>
              <p>
                For any questions, concerns, or requests relating to this Privacy Policy or your personal
                information, please contact us using the details provided on the Contact Us page of our website.
              </p>
              <p className="mt-3">
                We aim to respond to all privacy-related enquiries within 48 hours.
              </p>
            </section>

            <div className="border-t border-[#E2E8F0] pt-8 text-sm text-[#64748B]">
              <p>
                [Company Name] · ABN: [Insert ABN] · Australia · Effective: [Insert Date]
              </p>
              <p className="mt-1">
                This policy is governed by the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}