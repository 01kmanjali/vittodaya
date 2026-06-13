import Link from "next/link";

const sections = [
  {
    id: "information-collected",
    title: "1. Information We Collect",
    content: `We collect information that you provide directly to us and information that is generated automatically when you use our services.

**Information you provide:**
- Personal identification information: full name, date of birth, gender, PAN card number, Aadhaar number
- Contact information: mobile number, email address, residential and office address
- Financial information: income details, bank account information, existing loan/EMI obligations, credit score (retrieved with your consent)
- KYC documents: identity proof, address proof, income proof, and other documents required for loan processing
- Application data: loan amount requested, purpose of loan, preferred tenure

**Information collected automatically:**
- Device information: device type, operating system, browser type
- Usage data: pages visited, features used, time spent on the platform
- IP address and approximate geographic location
- Cookies and similar tracking technologies (see our Cookie Policy below)`,
  },
  {
    id: "use-of-information",
    title: "2. How We Use Your Information",
    content: `We use the information collected for the following purposes:

- **Loan Processing & Underwriting:** To evaluate your loan application, conduct credit assessment, and make lending decisions
- **KYC & Verification:** To verify your identity and documents as required by RBI/PMLA regulations
- **Service Delivery:** To disburse loans, collect repayments, and service your account
- **Communication:** To send application status updates, payment reminders, account statements, and important regulatory notices
- **Marketing:** To send information about new products, offers, and services (only with your consent; you may opt out at any time)
- **Compliance & Legal:** To comply with applicable laws, RBI directions, and court orders
- **Fraud Prevention:** To detect, investigate, and prevent fraudulent transactions and misuse of services
- **Platform Improvement:** To analyse usage patterns and improve our website and application experience`,
  },
  {
    id: "sharing",
    title: "3. How We Share Your Information",
    content: `We do not sell your personal data. We may share your information in the following circumstances:

- **Credit Bureaus:** We share your credit information with CIBIL, Experian, Equifax, or CRIF as required by RBI regulations and your consent during application
- **Co-lending Partners:** For co-originated loan products, we share necessary information with our banking and NBFC partners under executed agreements
- **KYC Service Providers:** We use authorised KYC/eKYC agencies (UIDAI-authorised ASAs) to verify your Aadhaar details
- **Collection Agencies:** In case of loan delinquency, we may engage authorised collection agencies who are bound by confidentiality obligations
- **Technology Service Providers:** Cloud hosting, SMS/email providers, and analytics vendors who process data on our behalf under data processing agreements
- **Regulatory Authorities:** RBI, SEBI, FIU-IND, courts, or government agencies when required by law
- **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your data may be transferred with prior notice to you`,
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: `We implement industry-standard security measures to protect your personal information:

- **Encryption:** All data in transit is encrypted using TLS 1.2 or higher. Sensitive data at rest is encrypted using AES-256
- **Access Controls:** Strict role-based access controls ensure only authorised personnel can access your information
- **Audit Trails:** All access to customer data is logged and regularly audited
- **ISO 27001 Practices:** Our information security management follows ISO 27001 principles
- **Vulnerability Management:** Regular penetration testing and security assessments are conducted by independent security firms
- **Incident Response:** We have a documented data breach response plan. In the event of a breach affecting your data, we will notify you as required by applicable law

Despite these measures, no system is completely immune to security risks. We encourage you to use strong passwords, keep your login credentials confidential, and report any suspicious activity immediately.`,
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    content: `We retain your personal data for as long as necessary to fulfil the purposes described in this Policy and to comply with legal obligations:

- **Loan application data (approved):** Retained for a minimum of 8 years from loan closure, as required by RBI guidelines
- **Loan application data (rejected/withdrawn):** Retained for 3 years from date of rejection
- **KYC records:** Retained for 5 years after the end of the customer relationship, as mandated by PMLA, 2002
- **Communication records:** Retained for 3 years for regulatory and dispute resolution purposes
- **Marketing consent records:** Retained for 3 years from the date of consent or withdrawal

After the applicable retention period, data is securely deleted or anonymised.`,
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: `Under applicable data protection laws (including India's Digital Personal Data Protection Act, 2023), you have the following rights:

- **Right to Access:** Request a copy of the personal data we hold about you
- **Right to Correction:** Request correction of inaccurate or incomplete personal data
- **Right to Erasure:** Request deletion of your personal data, subject to legal retention obligations
- **Right to Withdraw Consent:** Withdraw consent for marketing communications at any time without affecting the lawfulness of prior processing
- **Right to Grievance Redressal:** Raise a complaint with our Data Protection Officer or with the Data Protection Board of India (once constituted)
- **Right to Nominate:** Nominate a person to exercise your rights on your behalf in the event of your death or incapacity

To exercise any of these rights, contact our Data Protection Officer at **dpo@vfspl.in** with your registered email and mobile number. We will respond within 30 days.`,
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking",
    content: `Our website uses cookies and similar technologies to enhance your experience:

- **Strictly Necessary Cookies:** Required for the website to function. These cannot be disabled.
- **Analytics Cookies:** Help us understand how visitors interact with our website (e.g., Google Analytics). These can be disabled.
- **Marketing Cookies:** Used to deliver relevant advertisements. These can be disabled.

You can manage cookie preferences through your browser settings. Disabling cookies may affect certain website features. A detailed Cookie Policy is available on our website.`,
  },
  {
    id: "third-party",
    title: "8. Third-Party Links",
    content: `Our website may contain links to third-party websites (e.g., partner bank portals, payment gateways). We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policy of any third-party site you visit.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: `Our services are intended for individuals who are 18 years of age or older. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a person under 18, please contact us immediately at dpo@vfspl.in and we will delete such information promptly.`,
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or applicable laws. When we make material changes, we will notify you via:
- Email to your registered email address
- A prominent notice on our website

The updated Policy will take effect 30 days after the notification, unless you object. Continued use of our services after the effective date constitutes acceptance of the updated Policy. The "Last Updated" date at the top of this page will always reflect the most recent version.`,
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: `For any queries, concerns, or requests related to this Privacy Policy or your personal data, please contact:

**Data Protection Officer**
Vittodaya Financial Services Pvt. Ltd.
[Office Address], Mumbai, Maharashtra – 400001

Email: **dpo@vfspl.in**
Phone: **+91 98765 43210** (Mon–Sat, 9 AM–6 PM)

If you are not satisfied with our response, you may contact the Data Protection Board of India (once constituted under the DPDPA, 2023) or approach appropriate courts for redressal.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-blue-200 text-sm">
            Last Updated: <strong className="text-white">01 June 2025</strong> &nbsp;·&nbsp; Effective Date: <strong className="text-white">01 June 2025</strong>
          </p>
          <p className="text-blue-100 mt-4 leading-relaxed max-w-2xl">
            Vittodaya Financial Services Pvt. Ltd. (&quot;Vittodaya&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your
            personal data. This Privacy Policy explains how we collect, use, share, and protect your
            information when you use our website, mobile application, or financial services.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>Contents</p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 p-4 rounded-xl border" style={{ background: "var(--bg-light)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Questions?</p>
                <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>Contact our Data Protection Officer</p>
                <a href="mailto:dpo@vfspl.in" className="text-xs font-medium" style={{ color: "var(--primary)" }}>dpo@vfspl.in</a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3 space-y-10">
            {/* Scope notice */}
            <div className="rounded-2xl border p-5" style={{ background: "var(--secondary-bg)", borderColor: "var(--secondary-border)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--secondary-dark)" }}>
                <strong>Scope:</strong> This Policy applies to all individuals who visit our website at <strong>vfspl.in</strong>,
                apply for or use our financial products (loans, fixed deposits), or interact with us through any channel.
                By using our services, you agree to the collection and use of information as described in this Policy.
              </p>
            </div>

            {sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{section.title}</h2>
                <div className="prose prose-sm max-w-none">
                  {section.content.split("\n").map((para, i) => {
                    if (!para.trim()) return null;
                    if (para.startsWith("**") && para.endsWith("**") && !para.slice(2, -2).includes("**")) {
                      return (
                        <h3 key={i} className="font-semibold mt-4 mb-1 text-sm" style={{ color: "var(--text-primary)" }}>
                          {para.replace(/\*\*/g, "")}
                        </h3>
                      );
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <li key={i} className="flex items-start gap-2 text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>
                          <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--secondary)" }} />
                          <span dangerouslySetInnerHTML={{ __html: para.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") }} />
                        </li>
                      );
                    }
                    return (
                      <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}
                        dangerouslySetInnerHTML={{ __html: para.replace(/\*\*([^*]+)\*\*/g, "<strong style='color:var(--text-primary)'>$1</strong>") }}
                      />
                    );
                  })}
                </div>
                <div className="mt-6 border-t" style={{ borderColor: "var(--border)" }} />
              </section>
            ))}

            {/* Footer note */}
            <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--bg-light)", borderColor: "var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                This Privacy Policy is governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Link href="/contact" className="text-xs font-medium" style={{ color: "var(--primary)" }}>Contact Us</Link>
                <Link href="/faq" className="text-xs font-medium" style={{ color: "var(--primary)" }}>FAQs</Link>
                <Link href="/about" className="text-xs font-medium" style={{ color: "var(--primary)" }}>About Us</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
