"use client";

import { useState } from "react";
import Image from "next/image";
import { newsArticles, pressReleases, awards, mediaContact } from "@/constants/newsMedia";
import {
  Newspaper, Trophy, Megaphone, Layers,
  Download, Mail, Phone, ArrowRight, Clock, ExternalLink,
} from "lucide-react";

const categoryFilters = [
  { id: "all",           label: "All Stories",        icon: <Layers className="w-4 h-4" />,    color: "#0f4c81", bg: "#eff6ff" },
  { id: "press-release", label: "Press Releases",     icon: <Newspaper className="w-4 h-4" />, color: "#7c3aed", bg: "#ede9fe" },
  { id: "media-coverage",label: "Media Coverage",     icon: <ExternalLink className="w-4 h-4" />,color: "#059669", bg: "#d1fae5" },
  { id: "awards",        label: "Awards",             icon: <Trophy className="w-4 h-4" />,    color: "#b45309", bg: "#fef3c7" },
  { id: "announcement",  label: "Announcements",      icon: <Megaphone className="w-4 h-4" />, color: "#0369a1", bg: "#e0f2fe" },
];

export default function NewsMediaPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? newsArticles
    : newsArticles.filter(n => n.category === activeCategory);

  const featured = newsArticles.filter(n => n.isFeatured);

  const catMeta = (id: string) => categoryFilters.find(c => c.id === id) ?? categoryFilters[0];

  return (
    <>
      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
              <Newspaper className="w-4 h-4" /> News & Media
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Latest News &<br />
              <span style={{ color: "var(--secondary-light)" }}>Press Coverage</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Stay up to date with Vittodaya&apos;s milestones, product launches, partnerships, and media features.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: `${newsArticles.length}+`, label: "Stories published" },
                { value: `${pressReleases.length}+`, label: "Press releases" },
                { value: `${awards.length}+`, label: "Awards won" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center">
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-xs text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Stories ── */}
      <section className="py-16" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#eff6ff", color: "var(--primary)" }}>
              Editor&apos;s Pick
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Featured Stories</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {featured.map((article, i) => {
              const meta = catMeta(article.category);
              return (
                <div
                  key={article.id}
                  className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${i === 0 ? "lg:col-span-2" : ""}`}
                  style={{ border: "1.5px solid var(--border)" }}
                >
                  <div className="relative h-44">
                    <Image src={`https://picsum.photos/seed/news-${article.id}/800/320`} alt={article.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur" style={{ background: meta.bg + "cc", color: meta.color }}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{article.publishedDate} · {article.readTime}</span>
                    </div>
                    <h3 className="font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>{article.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{article.excerpt}</p>
                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{article.source}</span>
                      <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: meta.color }}>
                        Read More <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── All News with filter ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#d1fae5", color: "#059669" }}>
              All Coverage
            </span>
            <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Browse by Category</h2>
            {/* Filter tabs */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl" style={{ background: "var(--bg-light)", border: "1px solid var(--border)" }}>
              {categoryFilters.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveCategory(f.id)}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                  style={
                    activeCategory === f.id
                      ? { background: f.color, color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  {f.icon} {f.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-md"
                    style={
                      activeCategory === f.id
                        ? { background: "rgba(255,255,255,0.25)" }
                        : { background: "#e2e8f0", color: "var(--text-secondary)" }
                    }
                  >
                    {f.id === "all" ? newsArticles.length : newsArticles.filter(n => n.category === f.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(article => {
              const meta = catMeta(article.category);
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ border: "1.5px solid var(--border)" }}
                >
                  <div className="relative h-36">
                    <Image src={`https://picsum.photos/seed/news-${article.id}/600/224`} alt={article.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur" style={{ background: meta.bg + "dd", color: meta.color }}>
                        {meta.icon}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1.5 leading-snug" style={{ color: "var(--text-primary)" }}>{article.title}</h3>
                    <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{article.excerpt}</p>
                    <div className="flex items-center justify-between border-t pt-2.5" style={{ borderColor: "var(--border)" }}>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{article.publishedDate}</span>
                      <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: meta.color }}>
                        Read <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Press Releases & Awards ── */}
      <section className="py-16" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#fef3c7", color: "#b45309" }}>
              Archives
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Press Releases & Awards</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Press Releases */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                  <Newspaper className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Press Release Archive</h3>
              </div>
              <div className="space-y-3">
                {pressReleases.map(pr => (
                  <div key={pr.id} className="bg-white rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-sm" style={{ border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{pr.title}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{pr.date} · {pr.fileSize}</p>
                      </div>
                    </div>
                    <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 ml-3 transition-colors" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fef3c7", color: "#b45309" }}>
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Awards & Recognition</h3>
              </div>
              <div className="space-y-3">
                {awards.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl p-4 transition-all hover:shadow-sm" style={{ border: "1.5px solid var(--border)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fef3c7", color: "#b45309" }}>
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#b45309" }}>{a.year}</span>
                        </div>
                        <p className="text-xs font-medium mb-1" style={{ color: "#b45309" }}>{a.awardedBy}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{a.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Media Contact CTA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="relative z-10 p-8 sm:p-12 grid sm:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Media Enquiries</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                For press, media, and analyst queries, please reach out to our communications team. We respond within 24 hours.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-3" style={{ background: "var(--primary)" }}>
                {mediaContact.name.charAt(0)}
              </div>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>{mediaContact.name}</p>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{mediaContact.designation}</p>
              <div className="space-y-2">
                <a href={`mailto:${mediaContact.email}`} className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: "var(--primary)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#eff6ff" }}>
                    <Mail className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  </div>
                  {mediaContact.email}
                </a>
                <a href={`tel:${mediaContact.phone}`} className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: "var(--primary)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#eff6ff" }}>
                    <Phone className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  </div>
                  {mediaContact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
