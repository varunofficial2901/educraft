import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EduCraft",
  description: "Terms of service and use licenses for EduCraft.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-[120px] pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#E2E8F0] p-10 md:p-14">
          <div className="text-center mb-12">
            {/* <p className="text-sm uppercase tracking-[0.4em] text-[#6366F1] font-semibold mb-4"> */}
              {/* Legal Terms */}
            {/* </p> */}
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#0F172A] mb-4">
              Terms of Service
            </h1>
            <p className="text-base md:text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed">
              Please review these terms carefully before using EduCraft. By accessing or using this site, you agree to comply with and be bound by these conditions.
            </p>
          </div>

          <div className="space-y-10 text-[#334155] leading-relaxed">

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">1. Acceptance of Terms</h2>
              <p>
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (the user or
                the parent/guardian purchasing on behalf of a student) and [Company Name] ABN: [Insert ABN], an
                Australian-registered business (&quot;we&quot;, &quot;us&quot;, or &quot;the Platform&quot;).
              </p>
              <p className="mt-3">
                By registering an account or accessing the platform in any way, you confirm that you have read,
                understood, and agree to these Terms. Where a parent or guardian is creating an account or purchasing
                a bundle on behalf of a child, they accept these Terms on that child&apos;s behalf and take full
                responsibility for the child&apos;s use of the platform.
              </p>
              <p className="mt-3">
                These Terms are governed by the laws of Australia. Any disputes will be subject to the exclusive
                jurisdiction of Australian courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">2. Platform Services</h2>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">What We Offer</h3>
              <p className="mb-2">
                Our platform provides online educational assessments for school students. All tests are conducted
                exclusively within the platform and are not downloadable or printable.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access to subject-based MCQ assessments organised within bundles</li>
                <li>Each bundle contains 4 subjects, each with individual tests</li>
                <li>Immediate results and performance feedback upon test submission</li>
                <li>A personal account to track test history and progress</li>
                <li>Secure, protected test delivery with anti-piracy measures</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">Account Features</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Personal dashboard showing purchased bundles and test history</li>
                <li>Single-device login enforcement for security</li>
                <li>Session management and activity monitoring</li>
                <li>Purchase history and transaction records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">3. Eligibility &amp; Account Registration</h2>
              <p className="mb-3">
                Our platform is designed for Year 6 school students. Purchases are typically made by a parent or
                guardian on behalf of the student.
              </p>
              <p className="mb-2">By creating an account, you confirm that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All registration information provided is accurate and up to date</li>
                <li>You will keep your login credentials confidential and not share them with anyone</li>
                <li>You are responsible for all activity that occurs under your account</li>
                <li>You will notify us immediately of any unauthorised access to your account</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">Parental Responsibility</h3>
              <p>
                Where a student account is created or a purchase is made by a parent or guardian, the parent or
                guardian accepts full responsibility for ensuring the student complies with these Terms. By
                proceeding, the parent or guardian consents to the student&apos;s use of the platform under these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">4. Bundle Access &amp; Expiry</h2>
              <p className="mb-3">
                Purchasing a bundle grants the registered student account access to the associated content for the
                duration selected at the time of purchase (either 1 year or 2 years from the date of purchase).
              </p>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-4 mb-2">During Active Access</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>The student may attempt all tests within the purchased bundle</li>
                <li>Tests are accessible on a single registered device only</li>
                <li>Progress and results are saved to the account</li>
                <li>Access to updated content is included within the purchase period</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">Upon Expiry</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>All content within the bundle will become inaccessible</li>
                <li>The student account remains active but content will be locked</li>
                <li>Continued access requires a new bundle purchase</li>
                <li>Previously completed test results remain visible in the account</li>
              </ul>

              <p className="mt-4">
                Bundle access periods are clearly displayed before purchase. We do not offer automatic renewals
                without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">5. Payment Terms</h2>

              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Pricing &amp; Payment</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>All prices are listed in Australian Dollars (AUD) and include GST where applicable</li>
                <li>Bundle purchases are one-time payments — there are no recurring charges</li>
                <li>Payments are processed securely through our payment provider</li>
                <li>A transaction confirmation will be sent to the registered email address upon successful payment</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">No Refund Policy</h3>
              <p className="mb-2">
                All bundle purchases are final. We do not offer refunds under any circumstances, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Change of mind after purchase</li>
                <li>Failure to use the bundle before expiry</li>
                <li>Technical issues on the user&apos;s device or internet connection</li>
                <li>Account suspension or termination due to a violation of these Terms</li>
              </ul>

              <p className="mt-4">
                By completing a purchase, you acknowledge and agree that all sales are final and non-refundable. We
                strongly encourage you to review all bundle details before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">6. User Responsibilities</h2>
              <p className="mb-4">By using the platform, you agree to the following:</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Account Security</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use only one device for platform access</li>
                    <li>Keep login credentials confidential</li>
                    <li>Not share your account with any other person</li>
                    <li>Keep account information accurate and up to date</li>
                    <li>Report any suspicious account activity immediately</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Content Usage</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use content for personal educational purposes only</li>
                    <li>Not share, copy, or distribute any platform content</li>
                    <li>Respect the intellectual property rights of the platform</li>
                    <li>Comply with all anti-piracy measures in place</li>
                    <li>Not attempt to circumvent any security or access controls</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">7. Prohibited Activities</h2>
              <p className="mb-4">
                The following activities are strictly prohibited and may result in account suspension or permanent
                termination:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Security Violations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Logging in from multiple devices simultaneously</li>
                    <li>Sharing account credentials with others</li>
                    <li>Attempting to bypass single-device enforcement</li>
                    <li>Using developer tools to access protected content</li>
                    <li>Automated access, scraping, or bot usage</li>
                    <li>Attempting to hack, reverse-engineer, or disrupt the platform</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Content Violations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Taking screenshots or screen recordings of any test content</li>
                    <li>Downloading, copying, or reproducing any content</li>
                    <li>Sharing test questions or answers with others</li>
                    <li>Distributing content publicly in any format</li>
                    <li>Commercial use of any platform content</li>
                    <li>Reproducing content for tutoring or coaching purposes</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">Enforcement</h3>
              <p>
                Violations will be assessed on a case-by-case basis. Minor violations may result in a warning.
                Serious violations — including account sharing, screen recording, or content distribution — will
                result in immediate and permanent account termination without notice and without refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">8. Anti-Piracy &amp; Content Protection</h2>
              <p className="mb-3">
                Our platform employs active technical measures to protect all educational content, including:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Screenshot and screen recording detection and blocking</li>
                <li>Single-device session enforcement and device fingerprinting</li>
                <li>Real-time session monitoring and suspicious activity detection</li>
                <li>Secure content delivery with access controls</li>
              </ul>
              <p className="mt-4">
                Any attempt to circumvent these protections is a serious violation of these Terms and may constitute
                an offence under Australian copyright law. We reserve the right to pursue legal action where content
                is reproduced, distributed, or commercially exploited without authorisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">9. Intellectual Property</h2>
              <p>
                All content on this platform — including but not limited to MCQ tests, questions, answers,
                explanations, graphics, and platform design — is the exclusive intellectual property of [Company
                Name] and is protected under Australian copyright law.
              </p>
              <p className="mt-3 mb-2">
                Purchasing a bundle grants you a limited, personal, non-transferable licence to access and use the
                content solely for the student&apos;s private educational purposes during the active access period.
                This licence does not permit:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reselling or commercially exploiting any content</li>
                <li>Redistributing content to any other person</li>
                <li>Sharing content publicly online or offline</li>
                <li>Creating derivative works based on platform content</li>
                <li>Using content for tutoring, coaching, or any commercial activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">10. Service Availability</h2>

              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Platform Uptime</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>We aim to maintain high platform availability but do not guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance where possible</li>
                <li>Emergency maintenance may occur without prior notice</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">Content Updates</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Educational content may be updated or revised during your access period</li>
                <li>Access to updated content is included within your purchased bundle</li>
                <li>We reserve the right to modify, add, or remove content at any time</li>
              </ul>

              <p className="mt-4">
                We are not liable for any loss of access due to scheduled or unscheduled maintenance, internet
                outages on the user&apos;s end, or device compatibility issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">11. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by Australian law, [Company Name] provides the platform and all
                content &quot;as is&quot; without warranties of any kind, express or implied.
              </p>
              <p className="mb-2">We are not liable for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Academic performance, exam results, or educational outcomes</li>
                <li>Technical issues, service interruptions, or loss of access</li>
                <li>Inaccuracies or errors in content</li>
                <li>Indirect, incidental, or consequential damages of any kind</li>
                <li>Loss of data or saved progress due to technical failures</li>
              </ul>
              <p className="mt-4">
                Where liability cannot be excluded under Australian Consumer Law, our total liability is limited to
                the amount paid for the specific bundle giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">12. Account Termination</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">User Termination</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You may request account deletion by contacting us</li>
                    <li>Upon deletion, all content access will be revoked</li>
                    <li>Personal data will be handled per our Privacy Policy</li>
                    <li>No refund will be issued for unused bundle access</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Platform Termination</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We may suspend or terminate accounts for Terms violations</li>
                    <li>Immediate termination for serious violations (sharing, piracy)</li>
                    <li>Warning issued before termination for minor violations</li>
                    <li>An appeal process is available for disputed terminations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">13. Changes to These Terms</h2>
              <p>
                We reserve the right to update or modify these Terms at any time. When material changes are made, we
                will notify registered users by email or by displaying a notice on the platform.
              </p>
              <p className="mt-3">
                Continued use of the platform after the updated Terms take effect constitutes acceptance of the
                revised Terms. If you do not agree to the changes, you must stop using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-4">14. Contact &amp; Legal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Contact Support</h3>
                  <p>
                    For all enquiries, please use the contact details on our Contact Us page. Response time: within
                    2 business days.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Governing Law</h3>
                  <p>
                    These Terms are governed by the laws of Australia. Jurisdiction: Australian courts.
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-[#E2E8F0] pt-8 text-sm text-[#64748B]">
              <p>[Company Name] · ABN: [Insert ABN] · Australia</p>
              <p className="mt-1">
                Effective Date: [Insert Date] | Last Updated: [Insert Date]
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}