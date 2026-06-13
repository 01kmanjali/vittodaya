"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, ArrowRight } from "lucide-react";

const contactDetails = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Visit Us",
    lines: ["Vittodaya Financial Services Pvt. Ltd.", "Level 5, Express Towers", "Nariman Point, Mumbai 400 021"],
    color: "#0f4c81", bg: "#eff6ff",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Call Us",
    lines: ["+91 98765 43210", "+91 22 4321 0000", "1800-XXX-XXXX (Toll Free)"],
    color: "#059669", bg: "#d1fae5",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email Us",
    lines: ["support@vfspl.in", "invest@vfspl.in", "careers@vfspl.in"],
    color: "#7c3aed", bg: "#ede9fe",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Working Hours",
    lines: ["Mon – Fri: 9:00 AM – 6:00 PM", "Saturday: 10:00 AM – 2:00 PM", "Sunday: Closed"],
    color: "#b45309", bg: "#fef3c7",
  },
];

export default function ContactPage() {
  return (
    <div style={{ background: "var(--bg-light)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <MessageCircle className="w-4 h-4" /> Get In Touch
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                We&apos;d love to<br />
                <span style={{ color: "var(--secondary-light)" }}>hear from you</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Our support team is here Monday – Saturday, 9 AM to 6 PM. We typically respond within 2 hours.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "2 hrs", label: "Avg response" },
                  { value: "150+", label: "Branch offices" },
                  { value: "Mon–Sat", label: "Support days" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image src="/images/partner.jpeg" alt="Vittodaya office" width={600} height={380} className="w-full object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact detail cards ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactDetails.map(d => (
            <div key={d.title} className="bg-white rounded-2xl p-5 shadow-md" style={{ border: `1.5px solid ${d.bg}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: d.bg, color: d.color }}>
                {d.icon}
              </div>
              <p className="text-xs font-bold mb-1.5" style={{ color: d.color }}>{d.title}</p>
              {d.lines.map(line => (
                <p key={line} className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Info ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Contact Form — takes 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm p-8" style={{ border: "1.5px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#eff6ff", color: "var(--primary)" }}>
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Send Us a Message</h2>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>We&apos;ll get back to you within 2 hours</p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", type: "text",  placeholder: "Anjali" },
                  { label: "Last Name",  type: "text",  placeholder: "Sharma" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow"
                      style={{ borderColor: "var(--border)" }}
                      onFocus={e => (e.target.style.boxShadow = "0 0 0 3px #bfdbfe")}
                      onBlur={e => (e.target.style.boxShadow = "none")}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>Email Address</label>
                <input type="email" placeholder="you@email.com"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow"
                  style={{ borderColor: "var(--border)" }}
                  onFocus={e => (e.target.style.boxShadow = "0 0 0 3px #bfdbfe")}
                  onBlur={e => (e.target.style.boxShadow = "none")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow"
                  style={{ borderColor: "var(--border)" }}
                  onFocus={e => (e.target.style.boxShadow = "0 0 0 3px #bfdbfe")}
                  onBlur={e => (e.target.style.boxShadow = "none")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>What can we help with?</label>
                <select
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {["FD Investment Query", "Loan Application", "Account Support", "KYC / Documentation", "Technical Issue", "Other"].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>Your Message</label>
                <textarea rows={4} placeholder="Tell us how we can help…"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-shadow resize-none"
                  style={{ borderColor: "var(--border)" }}
                  onFocus={e => (e.target.style.boxShadow = "0 0 0 3px #bfdbfe")}
                  onBlur={e => (e.target.style.boxShadow = "none")}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Right sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1.5px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>Quick Links</p>
              {[
                { label: "View FAQs", href: "/faq", color: "#0f4c81", bg: "#eff6ff" },
                { label: "Loan Calculator", href: "/loans/personal", color: "#7c3aed", bg: "#ede9fe" },
                { label: "FD Rates", href: "/fd", color: "#059669", bg: "#d1fae5" },
                { label: "Investor Relations", href: "/investor-relations", color: "#b45309", bg: "#fef3c7" },
              ].map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 last:mb-0 transition-all hover:shadow-sm group"
                  style={{ background: l.bg }}
                >
                  <span className="text-sm font-semibold" style={{ color: l.color }}>{l.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: l.color }} />
                </a>
              ))}
            </div>

            {/* Social / emergency */}
            <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <p className="font-bold mb-1">Need urgent help?</p>
              <p className="text-sm text-blue-100 mb-4">Our toll-free support line is open Mon–Sat, 9 AM–6 PM.</p>
              <a href="tel:1800XXXXXXX" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/30 transition-colors">
                <Phone className="w-4 h-4" /> 1800-XXX-XXXX
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
