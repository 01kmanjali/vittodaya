"use client";

import { useState } from "react";
import Link from "next/link";
import { useCareers } from "@/lib/queries/useCareers";
import { companyValues, benefits } from "@/constants/careers";

export default function CareersPage() {
  const { data: careers = [], isLoading } = useCareers({ active: "true" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState("all");

  const activeJobs = careers.filter(j => j.isActive);
  const departments = ["all", ...Array.from(new Set(activeJobs.map(j => j.department)))];
  const filtered = filterDept === "all" ? activeJobs : activeJobs.filter(j => j.department === filterDept);

  return (
    <>
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/15 mb-4">
              Careers
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Join Our Team</h1>
            <p className="text-blue-100 text-base leading-relaxed mb-6">
              Build your career at Vittodaya and help shape the future of financial services in India.
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{activeJobs.length}</p>
                <p className="text-xs text-blue-200">Open Positions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{departments.length - 1}</p>
                <p className="text-xs text-blue-200">Departments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(companyValues as Array<{ icon: string; title: string; desc: string }>).map(v => (
              <div key={v.title} className="bg-white rounded-2xl border p-5 text-center" style={{ borderColor: "var(--border)" }}>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Open Positions</h2>
            <div className="flex gap-2 flex-wrap">
              {departments.map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDept(d)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize"
                  style={filterDept === d
                    ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                    : { borderColor: "var(--border)", color: "var(--text-secondary)" }
                  }
                >
                  {d === "all" ? "All Departments" : d}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--bg-light)" }} />
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="space-y-4">
              {filtered.map(job => (
                <div key={job._id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <button
                    className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === job._id ? null : job._id)}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{job.department}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>{job.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span>📍 {job.location}</span>
                        <span>⏳ {job.experience}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                    </div>
                    <span className="text-xl" style={{ color: "var(--primary)" }}>{expandedId === job._id ? "−" : "+"}</span>
                  </button>
                  {expandedId === job._id && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--border)" }}>
                      {job.description && (
                        <p className="text-sm mt-4 mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{job.description}</p>
                      )}
                      {job.requirements?.length ? (
                        <>
                          <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-secondary)" }}>Requirements</h4>
                          <ul className="space-y-1 mb-4">
                            {job.requirements.map((r, i) => (
                              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                                <span className="text-green-500 mt-0.5">✓</span> {r}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                      <Link href="/contact" className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                        Apply Now →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {!filtered.length && (
                <p className="text-center py-10 text-sm" style={{ color: "var(--text-secondary)" }}>
                  No open positions in this department right now.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-12" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>Why Work With Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(benefits as Array<{ icon: string; title: string; desc: string }>).map(b => (
              <div key={b.title} className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}>
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: "var(--text-primary)" }}>{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
