"use client";

import { useState } from "react";
import {
  annualReports,
  financialResults,
  boardMembers,
  shareholdingPattern,
  corporateGovernanceDocs,
  keyFinancialHighlights,
} from "@/constants/investorRelations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, Clipboard, Scale, Download, TrendingUp, ChevronRight,
  BarChart3, BookOpen, Users, PieChart, Shield, ArrowUpRight,
} from "lucide-react";

const tabs = [
  { id: "highlights",    label: "Financial Highlights", Icon: BarChart3 },
  { id: "results",       label: "Financial Results",    Icon: TrendingUp },
  { id: "annual-reports",label: "Annual Reports",       Icon: BookOpen },
  { id: "board",         label: "Board of Directors",   Icon: Users },
  { id: "shareholding",  label: "Shareholding",         Icon: PieChart },
  { id: "governance",    label: "Governance",           Icon: Shield },
];

export default function InvestorRelationsPage() {
  const [activeTab, setActiveTab] = useState("highlights");

  return (
    <>
      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
              <BarChart3 className="w-4 h-4" /> Investor Relations
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Financial Transparency<br />
              <span style={{ color: "var(--secondary-light)" }}>&amp; Governance</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Access our financial results, annual reports, corporate governance disclosures, and board information.
              Vittodaya is committed to the highest standards of transparency for all stakeholders.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: `${annualReports.length}+`,          label: "Annual Reports" },
                { value: `${financialResults.length}+`,       label: "Results Published" },
                { value: `${boardMembers.length}`,            label: "Board Members" },
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

      {/* Tab Bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide gap-1 py-1">
            {tabs.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap my-1"
                  style={
                    isActive
                      ? { background: "var(--primary)", color: "white" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Financial Highlights ── */}
        {activeTab === "highlights" && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Key Financial Highlights</h2>
                <p className="text-sm mt-1 text-muted-foreground">As of Q3 FY2024–25</p>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Data
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {keyFinancialHighlights.map((h, i) => (
                <Card key={h.label} className={`hover-lift border animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
                  <CardContent className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{h.label}</p>
                    <p className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>{h.value}</p>
                    <div className="flex items-center gap-1.5">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                      <p className="text-xs font-semibold text-green-600">{h.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Disclaimer:</strong> The financial data presented here is for indicative purposes. Refer to the audited financial statements in the Annual Reports for verified figures. Past performance does not guarantee future results.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Financial Results ── */}
        {activeTab === "results" && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Financial Results</h2>
                <p className="text-sm mt-1 text-muted-foreground">Quarterly and annual performance disclosures</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Download className="h-3.5 w-3.5" /> Export All
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Period", "Type", "Revenue", "Net Profit", "Net NPA", "Published", ""].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialResults.map(r => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="font-semibold">{r.quarter}</TableCell>
                        <TableCell>
                          <Badge
                            variant={r.type === "annual" ? "secondary" : "outline"}
                            className={r.type === "annual" ? "bg-amber-100 text-amber-800 border-0" : "text-blue-700 border-blue-200 bg-blue-50"}
                          >
                            {r.type === "annual" ? "Annual" : "Quarterly"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{r.revenue}</TableCell>
                        <TableCell className="font-semibold text-green-600">{r.netProfit}</TableCell>
                        <TableCell className="text-muted-foreground">{r.npa}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{r.publishedDate}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--primary)" }}
                          >
                            <Download className="h-3.5 w-3.5" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Annual Reports ── */}
        {activeTab === "annual-reports" && (
          <div className="animate-fade-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Annual Reports</h2>
              <p className="text-sm mt-1 text-muted-foreground">Comprehensive yearly financial disclosures and management discussion</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {annualReports.map((r, i) => (
                <Card key={r.id} className={`hover-lift text-center animate-fade-up stagger-${i + 1} group`}>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div
                      className="w-16 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
                    >
                      <FileText className="h-8 w-8" style={{ color: "var(--primary)" }} />
                    </div>
                    <Badge variant="outline" className="mb-2 text-xs text-muted-foreground">Annual Report</Badge>
                    <p className="text-xl font-bold mb-1" style={{ color: "var(--primary)" }}>{r.year}</p>
                    <p className="text-xs text-muted-foreground mb-1">Published: {r.publishedDate}</p>
                    <p className="text-xs text-muted-foreground mb-5">{r.fileSize}</p>
                    <Button
                      type="button"
                      className="w-full gap-2 text-white"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" }}
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Board of Directors ── */}
        {activeTab === "board" && (
          <div className="animate-fade-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Board of Directors</h2>
              <p className="text-sm mt-1 text-muted-foreground">Leadership committed to excellence and stakeholder value</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {boardMembers.map((m, i) => (
                <Card key={m.id} className={`hover-lift animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" }}
                      >
                        {m.imageInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{m.name}</h3>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--secondary)" }}>{m.designation}</p>
                        <Badge variant="outline" className="mt-1.5 text-xs">{m.qualification}</Badge>
                      </div>
                    </div>
                    <Separator className="mb-3" />
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{m.experience}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Shareholding Pattern ── */}
        {activeTab === "shareholding" && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Shareholding Pattern</h2>
                <p className="text-sm mt-1 text-muted-foreground">As of 31 December 2024</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ownership Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-2">
                  {shareholdingPattern.map(s => (
                    <div key={s.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{s.category}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: s.color }}>{s.percentage}%</span>
                      </div>
                      <Progress value={s.percentage} className="h-2.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-base">Summary Table</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs text-right">% Holding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shareholdingPattern.map(s => (
                        <TableRow key={s.category}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                              {s.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold" style={{ color: s.color }}>
                            {s.percentage}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── Corporate Governance ── */}
        {activeTab === "governance" && (
          <div className="animate-fade-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Corporate Governance</h2>
              <p className="text-sm mt-1 text-muted-foreground">Policies, codes, and charters governing our operations</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {corporateGovernanceDocs.map((doc, i) => {
                const Icon = doc.type === "policy" ? Clipboard : doc.type === "code" ? Scale : FileText;
                const colors = {
                  policy:  { bg: "#eff6ff", color: "var(--primary)" },
                  code:    { bg: "#fdf4ff", color: "#7c3aed" },
                  charter: { bg: "#ecfdf5", color: "#059669" },
                };
                const c = colors[doc.type] ?? colors.charter;
                return (
                  <Card key={doc.id} className={`hover-lift group animate-fade-up stagger-${Math.min(i + 1, 8)}`}>
                    <CardContent className="p-5 flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: c.bg }}
                      >
                        <Icon className="h-5 w-5" style={{ color: c.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{doc.title}</h3>
                          <Badge variant="outline" className="text-xs capitalize shrink-0">{doc.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{doc.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Updated: {doc.publishedDate}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs gap-1 font-semibold"
                            style={{ color: c.color }}
                          >
                            Download <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
