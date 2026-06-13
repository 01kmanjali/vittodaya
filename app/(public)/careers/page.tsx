"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { jobOpenings, companyValues, benefits, departments, getActiveJobs } from "@/constants/careers";
import { MapPin, Building, Briefcase, Calendar, Check, Search, Users, Handshake, Scale, Rocket, Leaf, TrendingUp, DollarSign, BookOpen } from "lucide-react";

function mapEmojiToIcon(e?: string) {
  switch (e) {
    case "🤝": return <Handshake className="w-8 h-8" />;
    case "⚖️": return <Scale className="w-8 h-8" />;
    case "🚀": return <Rocket className="w-8 h-8" />;
    case "🌱": return <Leaf className="w-8 h-8" />;
    case "👥": return <Users className="w-8 h-8" />;
    case "📈": return <TrendingUp className="w-8 h-8" />;
    case "💰": return <DollarSign className="w-8 h-8" />;
    case "🏥": return <BookOpen className="w-8 h-8" />;
    case "📚": return <BookOpen className="w-8 h-8" />;
    default: return e ?? null;
  }
}

const typeColors: Record<string, { bg: string; text: string }> = {
  "full-time": { bg: "#eff6ff", text: "#1d4ed8" },
  "part-time": { bg: "#f0fdf4", text: "#15803d" },
  contract: { bg: "#fef9c3", text: "#b45309" },
  internship: { bg: "#fdf4ff", text: "#7e22ce" },
};

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [openJob, setOpenJob] = useState<string | null>(null);

  const filteredJobs = getActiveJobs(selectedDept === "All Departments" ? undefined : selectedDept);

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Partner-DSA.jpeg"
            alt="Vittodaya office culture"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-sm text-blue-200 font-medium mb-3 uppercase tracking-wide">Careers at Vittodaya</p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Build the Future of<br />
              <span style={{ color: "var(--secondary-light)" }}>Financial Inclusion</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8">
              Join a fast-growing RBI-registered NBFC that is making credit and savings accessible
              for every Indian. Work with passionate people solving real financial problems.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { label: "Open Positions", value: `${jobOpenings.filter(j => j.isActive).length}+` },
                { label: "Locations", value: "5 Cities" },
                { label: "Team Size", value: "200+" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture image strip */}
      <div className="grid grid-cols-3 h-40 sm:h-56 overflow-hidden">
        {["/images/Partner-DSA.jpeg", "/images/loans-hero.jpeg", "/images/about.jpeg"].map((src, i) => (
          <div key={src} className="relative">
            <Image
              src={src}
              alt={`Team culture ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Company Values */}
      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Our Culture & Values</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              What drives us every day at Vittodaya
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyValues.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border p-6 card-hover" style={{ borderColor: "var(--border)" }}>
                <span className="text-3xl mb-3 block">{mapEmojiToIcon(v.icon)}</span>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Why Work With Us?</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Benefits designed to support your career and well-being</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(b => (
              <div key={b.title} className="flex items-start gap-4 rounded-2xl border p-5 card-hover bg-white" style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl shrink-0">{mapEmojiToIcon(b.icon)}</span>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-16" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#eff6ff", color: "var(--primary)" }}>
              We&apos;re Hiring
            </span>
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Current Openings</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} available — find your next opportunity
            </p>
          </div>

          {/* Department filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 rounded-2xl max-w-3xl mx-auto" style={{ background: "white", border: "1px solid var(--border)" }}>
            {departments.map(dept => (
              <button
                type="button"
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                style={
                  selectedDept === dept
                    ? { background: "var(--primary)", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                    : { color: "var(--text-secondary)", background: "transparent" }
                }
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredJobs.map(job => {
              const tc = typeColors[job.type] ?? typeColors["full-time"];
              const isOpen = openJob === job.id;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    border: `1.5px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
                    boxShadow: isOpen ? "0 4px 24px rgba(15,76,129,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Header row */}
                  <button
                    type="button"
                    className="w-full text-left px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors"
                    style={{ background: isOpen ? "#f8faff" : "transparent" }}
                    onClick={() => setOpenJob(isOpen ? null : job.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                        <Briefcase className="w-5 h-5" style={{ color: "var(--primary)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
                          {job.isFeatured && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#fef9c3", color: "#b45309" }}>
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {job.department}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {job.postedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pl-14 sm:pl-0">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize" style={{ background: tc.bg, color: tc.text }}>
                        {job.type.replace("-", " ")}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200"
                        style={{
                          background: isOpen ? "var(--primary)" : "#f1f5f9",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="text-base font-bold leading-none" style={{ color: isOpen ? "white" : "var(--text-secondary)" }}>+</span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm leading-relaxed mt-5 mb-6 px-1" style={{ color: "var(--text-secondary)" }}>{job.description}</p>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="rounded-xl p-5" style={{ background: "#f8faff", border: "1px solid #e0eaff" }}>
                          <h4 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
                            <Check className="w-4 h-4" /> Key Responsibilities
                          </h4>
                          <ul className="space-y-2.5">
                            {job.responsibilities.map(r => (
                              <li key={r} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--primary)" }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl p-5" style={{ background: "#fffbf0", border: "1px solid #fde68a" }}>
                          <h4 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: "#b45309" }}>
                            <Search className="w-4 h-4" /> Requirements
                          </h4>
                          <ul className="space-y-2.5">
                            {job.requirements.map(r => (
                              <li key={r} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#b45309" }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
                        <a
                          href={`mailto:careers@vfspl.in?subject=Application for ${job.title} (${job.id})`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                          style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" }}
                        >
                          Apply for this Role →
                        </a>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          Email CV to <strong className="font-semibold" style={{ color: "var(--text-primary)" }}>careers@vfspl.in</strong>
                          {" "}· Subject: <span className="font-mono">{job.id}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: "var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#f1f5f9" }}>
                  <Search className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
                </div>
                <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No openings in this department</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Try a different department or check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Spontaneous Application CTA */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="relative z-10 p-8 sm:p-12 text-center text-white">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/15 backdrop-blur">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Don&apos;t See a Fit?</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
              We are always looking for talented, driven individuals. Send us your CV and we will reach out when a suitable opportunity arises.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="mailto:careers@vfspl.in?subject=Spontaneous Application – Vittodaya"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--secondary)", color: "white" }}
              >
                Send Open Application →
              </a>
              <span className="inline-flex items-center text-blue-100 text-xs self-center">
                careers@vfspl.in · Replies within 7 business days
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
