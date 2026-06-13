"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { newsArticles, pressReleases, awards } from "@/constants/newsMedia";

const categoryColors: Record<string, { bg: string; text: string }> = {
  "press-release": { bg: "#eff6ff", text: "#1d4ed8" },
  "media-coverage": { bg: "#f0fdf4", text: "#15803d" },
  awards: { bg: "#fef9c3", text: "#b45309" },
  announcement: { bg: "#fdf4ff", text: "#7e22ce" },
};

export default function AdminNewsMediaPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "press" | "awards">("articles");
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>News & Media</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage news articles, press releases, and awards</p>
        </div>
        <Button type="button" onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
          + Add News
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "News Articles", value: newsArticles.length, color: "var(--primary)" },
          { label: "Press Releases", value: pressReleases.length, color: "#059669" },
          { label: "Awards", value: awards.length, color: "#b45309" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-5" style={{ borderColor: "var(--border)" }}>
        {(["articles", "press", "awards"] as const).map(tab => (
          <Button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize"
            style={activeTab === tab ? { color: "var(--primary)", borderColor: "var(--primary)" } : { color: "var(--text-secondary)", borderColor: "transparent" }}
          >
            {tab === "press" ? "Press Releases" : tab === "articles" ? "News Articles" : "Awards"}
          </Button>
        ))}
      </div>

      {/* News Articles */}
      {activeTab === "articles" && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Title", "Category", "Source", "Published", "Featured", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {newsArticles.map(article => {
                const cc = categoryColors[article.category] ?? categoryColors["press-release"];
                return (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-sm line-clamp-2" style={{ color: "var(--text-primary)" }}>{article.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: cc.bg, color: cc.text }}>
                        {article.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{article.source}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{article.publishedDate}</td>
                    <td className="px-5 py-4">
                      {article.isFeatured
                        ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--secondary-bg)", color: "var(--secondary-dark)" }}>Featured</span>
                        : <span className="text-xs" style={{ color: "var(--text-secondary)" }}>—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit</Button>
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Press Releases */}
      {activeTab === "press" && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Title", "Date", "File Size", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {pressReleases.map(pr => (
                <tr key={pr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{pr.title}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{pr.date}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{pr.fileSize}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit</Button>
                      <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Awards */}
      {activeTab === "awards" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {awards.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                    <p className="text-xs" style={{ color: "var(--secondary)" }}>{a.awardedBy}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--secondary-bg)", color: "var(--secondary-dark)" }}>{a.year}</span>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{a.description}</p>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit</Button>
                  <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
