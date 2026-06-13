"use client";

import { useState } from "react";
import { useFAQs } from "@/lib/queries/useFAQs";

export default function FAQPage() {
  const { data: faqs = [], isLoading } = useFAQs({ active: "true" });
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map(f => f.category)));
  const filtered = activeCategory === "all" ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <>
      <section className="gradient-hero text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/15 mb-4">
            Help Center
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-blue-100 text-base leading-relaxed">
            Find answers to common questions about FDs, loans, and our platform.
          </p>
        </div>
      </section>

      <section className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
            style={activeCategory === "all" ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-all"
              style={activeCategory === cat ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--bg-light)" }} />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="space-y-3">
            {filtered.map(faq => (
              <div key={faq._id} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 font-medium text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-lg leading-none" style={{ color: "var(--primary)" }}>
                    {openId === faq._id ? "−" : "+"}
                  </span>
                </button>
                {openId === faq._id && (
                  <div className="px-5 pb-4 text-sm leading-relaxed border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            {!filtered.length && (
              <p className="text-center py-10 text-sm" style={{ color: "var(--text-secondary)" }}>
                No FAQs in this category yet.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
