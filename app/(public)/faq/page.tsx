"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Phone, HelpCircle, User, Factory, Zap, Home, Landmark,
  ChevronDown, MessageCircle, Mail, ArrowRight,
} from "lucide-react";
import { faqs, faqCategories, getFAQsByCategory } from "@/constants/faqs";

const categoryMeta: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  all:            { icon: <HelpCircle className="w-4 h-4" />,  color: "#0f4c81", bg: "#eff6ff" },
  "personal-loan":{ icon: <User className="w-4 h-4" />,        color: "#2563eb", bg: "#dbeafe" },
  "msme-loan":    { icon: <Factory className="w-4 h-4" />,     color: "#7c3aed", bg: "#ede9fe" },
  "ev-loan":      { icon: <Zap className="w-4 h-4" />,         color: "#059669", bg: "#d1fae5" },
  lap:            { icon: <Home className="w-4 h-4" />,         color: "#b45309", bg: "#fef3c7" },
  fd:             { icon: <Landmark className="w-4 h-4" />,     color: "#0369a1", bg: "#e0f2fe" },
  general:        { icon: <HelpCircle className="w-4 h-4" />,  color: "#64748b", bg: "#f1f5f9" },
};

function FAQItem({ faq, isOpen, onToggle }: { faq: (typeof faqs)[0]; isOpen: boolean; onToggle: () => void }) {
  const meta = categoryMeta[faq.category] ?? categoryMeta.general;
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1.5px solid ${isOpen ? meta.color : "var(--border)"}`,
        boxShadow: isOpen ? `0 4px 20px rgba(0,0,0,0.06)` : "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 transition-colors"
        style={{ background: isOpen ? meta.bg + "60" : "transparent" }}
      >
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.icon}
          </div>
          <span className="font-semibold text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {faq.question}
          </span>
        </div>
        <ChevronDown
          className="w-5 h-5 shrink-0 mt-0.5 transition-transform duration-300"
          style={{
            color: isOpen ? meta.color : "var(--text-secondary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {isOpen && (
        <div
          className="px-6 pb-5 pt-0"
          style={{ borderTop: `1px solid ${meta.bg}` }}
        >
          <div className="pl-10">
            <p className="text-sm leading-relaxed pt-3" style={{ color: "var(--text-secondary)" }}>
              {faq.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>("g-1");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryFaqs = getFAQsByCategory(activeCategory);
  const filteredFaqs = searchQuery
    ? faqs.filter(
        f =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFaqs;

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        {/* subtle decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "white" }} />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            How can we<br />
            <span style={{ color: "var(--secondary-light)" }}>help you?</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Find answers to common questions about our loans, fixed deposits, and services.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveCategory("all"); }}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-gray-900 text-sm outline-none shadow-xl"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { value: `${faqs.length}+`, label: "Questions answered" },
              { value: `${faqCategories.length - 1}`, label: "Topic categories" },
              { value: "24h", label: "Support response" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {searchQuery ? (
          /* ── Search results ── */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <strong className="font-semibold" style={{ color: "var(--text-primary)" }}>{filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}</strong>
                {" "}for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
            <div className="space-y-3">
              {filteredFaqs.map(faq => (
                <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
              ))}
              {filteredFaqs.length === 0 && (
                <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: "var(--border)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#f1f5f9" }}>
                    <Search className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No results found</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Try a different search term or browse by category below</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Browsing by category ── */
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Category sidebar */}
            <div className="lg:col-span-1">
              <p className="text-xs font-bold mb-4 uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                Browse by topic
              </p>
              <div className="space-y-1">
                {faqCategories.map(cat => {
                  const meta = categoryMeta[cat.id] ?? categoryMeta.general;
                  const count = cat.id === "all" ? faqs.length : faqs.filter(f => f.category === cat.id).length;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2 group"
                      style={
                        isActive
                          ? { background: meta.bg, color: meta.color, border: `1.5px solid ${meta.color}30` }
                          : { color: "var(--text-secondary)", border: "1.5px solid transparent" }
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={isActive ? { background: meta.color + "20", color: meta.color } : { background: "#f1f5f9", color: "var(--text-secondary)" }}
                        >
                          {meta.icon}
                        </span>
                        {cat.label}
                      </span>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-[22px] text-center"
                        style={isActive ? { background: meta.color, color: "white" } : { background: "#f1f5f9", color: "var(--text-secondary)" }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mini contact card */}
              <div className="mt-6 rounded-2xl p-5" style={{ background: "#f8faff", border: "1px solid #e0eaff" }}>
                <MessageCircle className="w-6 h-6 mb-3" style={{ color: "var(--primary)" }} />
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Can&apos;t find your answer?</p>
                <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>Our team typically replies within 2 hours.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Get in touch <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* FAQ list */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <strong className="font-bold" style={{ color: "var(--text-primary)" }}>{filteredFaqs.length}</strong>
                  {" "}FAQ{filteredFaqs.length !== 1 ? "s" : ""} in this category
                </p>
                {openId && (
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Collapse all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {filteredFaqs.map(faq => (
                  <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-16 relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="relative z-10 p-8 sm:p-10 text-center text-white">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/15 backdrop-blur">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
              Our support team is available Monday – Saturday, 9 AM to 6 PM. We typically respond within 2 hours.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--secondary)", color: "white" }}
              >
                <Mail className="w-4 h-4" /> Send a Message
              </Link>
              <a
                href="tel:1800XXXXXXX"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/15 backdrop-blur hover:bg-white/25 border border-white/30 transition-colors"
              >
                <Phone className="w-4 h-4" /> 1800-XXX-XXXX
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
