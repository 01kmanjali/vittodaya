import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const footerSections = [
  {
    title: "Loans",
    links: [
      { label: "Personal Loan", href: "/loans/personal" },
      { label: "MSME / Business Loan", href: "/loans/msme" },
      { label: "Electric Vehicle Loan", href: "/loans/ev" },
      { label: "Loan Against Property", href: "/loans/lap" },
    ],
  },
  {
    title: "Investments",
    links: [
      { label: "Fixed Deposits", href: "/fd" },
      { label: "Senior Citizen FD", href: "/fd" },
      { label: "Tax Saver FD", href: "/fd" },
      { label: "FD Calculator", href: "/fd" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Investor Relations", href: "/investor-relations" },
      { label: "News & Media", href: "/news-media" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t mt-16" style={{ background: "#0a3460" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
                <span className="font-bold text-sm" style={{ color: "#0f4c81" }}>V</span>
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight" style={{ color: "var(--secondary-light)" }}>Vittodaya</span>
                <span className="text-xs text-blue-300">Financial Services</span>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-4">
              Vittodaya Financial Services Pvt. Ltd. is an RBI-registered NBFC offering loans,
              fixed deposits, and comprehensive financial solutions for individuals and businesses across India.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge variant="outline" className="text-blue-300 border-blue-700 text-xs">RBI Registered</Badge>
              <Badge variant="outline" className="text-blue-300 border-blue-700 text-xs">CRISIL A (Stable)</Badge>
              <Badge variant="outline" className="text-blue-300 border-blue-700 text-xs">ISO 27001</Badge>
            </div>
            <div className="space-y-1.5 text-sm text-blue-200">
              <p>📞 1800-XXX-XXXX (Toll Free)</p>
              <p>✉ support@vfspl.in</p>
              <p>📍 Mumbai, Maharashtra, India – 400001</p>
            </div>
            <p className="text-xs text-blue-400 mt-3">CIN: U65929MH2015PTC000000 · RBI Reg. No.: B-13.00000</p>
          </div>

          {footerSections.map((section, i) => (
            <div key={section.title} className={`animate-fade-up stagger-${i + 2}`}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-blue-300 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-blue-800" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <p className="text-xs text-blue-400">© 2025 Vittodaya Financial Services Pvt. Ltd. All rights reserved.</p>
          <p className="text-xs text-blue-500 sm:text-right max-w-sm">
            Loans are subject to credit assessment. Fixed deposits are not insured by DICGC. Please read all offer documents carefully.
          </p>
        </div>
      </div>
    </footer>
  );
}
