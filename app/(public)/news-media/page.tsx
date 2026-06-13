"use client";

import { useState } from "react";
import { useNews } from "@/lib/queries/useNews";

const mediaContact = {
  name: "Priya Sharma",
  title: "Head of Communications",
  email: "media@vittodaya.com",
  phone: "+91 98765 43210",
};

export default function NewsMediaPage() {
  const { data: articles = [], isLoading } = useNews({ active: "true" });
  const [activeTab, setActiveTab] = useState<"all" | "press-release" | "awards">("all");

  const pressReleases = articles.filter(a => a.category === "press-release");
  const awards = articles.filter(a => a.category === "awards");
  const displayed =
    activeTab === "all" ? articles :
    activeTab === "press-release" ? pressReleases : awards;

  return (
    <>
      <section className="gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/15 mb-4">
              Newsroom
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">News & Media</h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Latest press releases, media coverage, and awards from Vittodaya Financial Services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          {(["all", "press-release", "awards"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
              style={activeTab === tab
                ? { color: "var(--primary)", borderColor: "var(--primary)" }
                : { color: "var(--text-secondary)", borderColor: "transparent" }
              }
            >
              {tab === "all" ? "All News" : tab === "press-release" ? "Press Releases" : "Awards"}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: "var(--bg-light)" }} />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map(article => (
              <div key={article._id} className="bg-white rounded-2xl border overflow-hidden card-hover" style={{ borderColor: "var(--border)" }}>
                <div
                  className="h-40 flex items-center justify-center text-white text-3xl font-bold"
                  style={{ background: article.imageColor ?? "var(--primary)" }}
                >
                  {article.imageInitial ?? article.title.charAt(0)}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: "#eff6ff", color: "#2563eb" }}>
                      {String(article.category).replace("-", " ")}
                    </span>
                    {article.publishedDate && (
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {new Date(String(article.publishedDate)).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {article.excerpt}
                    </p>
                  )}
                  {article.source && (
                    <p className="text-xs mt-3 font-medium" style={{ color: "var(--primary)" }}>
                      {article.source}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {!displayed.length && (
              <p className="col-span-3 text-center py-10 text-sm" style={{ color: "var(--text-secondary)" }}>
                No articles in this category yet.
              </p>
            )}
          </div>
        )}

        <div className="mt-14 rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ borderColor: "var(--border)", background: "var(--bg-light)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: "var(--primary)" }}>
            {mediaContact.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{mediaContact.name}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{mediaContact.title}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <a href={`mailto:${mediaContact.email}`} className="font-medium hover:underline" style={{ color: "var(--primary)" }}>{mediaContact.email}</a>
            <span style={{ color: "var(--text-secondary)" }}>{mediaContact.phone}</span>
          </div>
        </div>
      </section>
    </>
  );
}
