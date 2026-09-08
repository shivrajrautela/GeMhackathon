"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockBidders, mockTenders } from "@/lib/mock-data";
import {
  Search, AlertTriangle, CheckCircle, XCircle, ShieldCheck,
  Eye, Users, TrendingUp, Building, IndianRupee, FileText
} from "lucide-react";

// ─── Build enriched bidder directory across ALL tenders ─────────────────────
// Group by company name, aggregate scores
type EnrichedBidder = {
  companyName: string;
  bids: number;
  avgScore: number;
  highestRisk: "Low" | "Medium" | "High";
  everFlagged: boolean;
  tenders: string[];
  gstnStatus: string;
  panStatus: string;
  udyamStatus: string;
  financialTurnover: string;
  rank: number;
};

function buildDirectory(): EnrichedBidder[] {
  const map: Record<string, EnrichedBidder> = {};

  mockBidders.forEach((b) => {
    if (!map[b.companyName]) {
      map[b.companyName] = {
        companyName: b.companyName,
        bids: 0,
        avgScore: 0,
        highestRisk: "Low",
        everFlagged: false,
        tenders: [],
        gstnStatus: b.verification.gstn.status,
        panStatus: b.verification.pan.status,
        udyamStatus: b.verification.udyam.status,
        financialTurnover: b.financialTurnover,
        rank: 0,
      };
    }
    const entry = map[b.companyName];
    entry.bids += 1;
    entry.avgScore = Math.round((entry.avgScore * (entry.bids - 1) + b.complianceScore) / entry.bids);
    if (!entry.tenders.includes(b.tenderId)) entry.tenders.push(b.tenderId);
    if (b.riskTag === "High") { entry.highestRisk = "High"; entry.everFlagged = true; }
    else if (b.riskTag === "Medium" && entry.highestRisk !== "High") entry.highestRisk = "Medium";
    if (b.documentFlags.tamperingDetected) entry.everFlagged = true;
  });

  // Sort by avgScore desc, then assign rank
  const sorted = Object.values(map).sort((a, b) => b.avgScore - a.avgScore);
  sorted.forEach((entry, idx) => { entry.rank = idx + 1; });
  return sorted;
}

const rankLabel = (rank: number) => ["L1", "L2", "L3", "L4", "L5"][rank - 1] ?? `L${rank}`;
const rankColor = (rank: number) => {
  if (rank === 1) return "bg-green-100 text-green-800 border-green-300";
  if (rank === 2) return "bg-blue-100 text-blue-800 border-blue-200";
  if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
};
const riskColor = (risk: string) => {
  if (risk === "Low")    return "bg-green-50 text-green-700 border-green-200";
  if (risk === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};
const scoreColor = (score: number) => {
  if (score >= 70) return "text-green-700";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
};
const apiStatusIcon = (status: string) => {
  if (status === "Verified") return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
  if (status === "Failed" || status === "Flagged") return <XCircle className="h-3.5 w-3.5 text-red-600" />;
  return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
};

export default function BidderDirectoryPage() {
  const directory = buildDirectory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Low" | "Medium" | "High" | "Flagged">("All");

  const filtered = directory.filter((b) => {
    const matchSearch = b.companyName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All"     ? true :
      filter === "Flagged" ? b.everFlagged :
      b.highestRisk === filter;
    return matchSearch && matchFilter;
  });

  const flaggedCount = directory.filter(d => d.everFlagged).length;
  const highCount    = directory.filter(d => d.highestRisk === "High").length;
  const lowCount     = directory.filter(d => d.highestRisk === "Low").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bidder Directory</h2>
          <p className="text-slate-500 mt-1 text-sm">
            All registered MSMEs and contractors — auto-ranked by AI compliance score.{" "}
            <span className="font-semibold text-blue-700">Read-only view.</span>
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 font-semibold mt-1">
          <Users className="mr-1.5 h-3.5 w-3.5" /> {directory.length} Companies
        </Badge>
      </div>

      {/* ⚠ Flagged Banner */}
      {flaggedCount > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800 font-medium flex-1">
            <span className="font-bold">{flaggedCount} bidder{flaggedCount > 1 ? "s" : ""}</span> in this directory have been flagged for document tampering or Gov API mismatches in previous tenders.
            These companies are marked with a <span className="font-bold">⚠ HIGH RISK</span> tag.
          </p>
          <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
            onClick={() => setFilter("Flagged")}>
            Show Flagged Only
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Low Risk</p>
              <p className="text-3xl font-bold text-green-700">{lowCount}</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-green-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Medium Risk</p>
              <p className="text-3xl font-bold text-amber-600">{directory.filter(d => d.highestRisk === "Medium").length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">High Risk / Flagged</p>
              <p className="text-3xl font-bold text-red-600">{highCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-300" />
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search company name..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {(["All", "Low", "Medium", "High", "Flagged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === f
                  ? f === "All"     ? "bg-blue-700 text-white border-blue-700"
                  : f === "Low"     ? "bg-green-600 text-white border-green-600"
                  : f === "Medium"  ? "bg-amber-500 text-white border-amber-500"
                  : f === "High"    ? "bg-red-600 text-white border-red-600"
                  :                   "bg-red-800 text-white border-red-800"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
              }`}
            >
              {f === "Flagged" ? "⚠ Flagged" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Bidder Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center py-12 text-center space-y-2">
              <Search className="h-8 w-8 text-slate-300" />
              <p className="text-slate-500 font-semibold">No bidders match your search.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((bidder) => (
            <Card
              key={bidder.companyName}
              className={`shadow-sm hover:shadow-md transition-shadow ${
                bidder.everFlagged ? "border-l-4 border-l-red-500 bg-red-50/20" : ""
              }`}
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-5">

                  {/* Rank Badge */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <Badge variant="outline" className={`text-lg font-extrabold px-3 py-1 ${rankColor(bidder.rank)}`}>
                      {rankLabel(bidder.rank)}
                    </Badge>
                    <p className="text-xs text-slate-400 font-medium">Rank</p>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 space-y-3">

                    {/* Company name + flags */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                            <Building className="h-4 w-4 text-slate-400" />
                            {bidder.companyName}
                          </h3>
                          {bidder.everFlagged && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs font-bold animate-pulse">
                              <AlertTriangle className="mr-1 h-3 w-3" /> PREVIOUSLY FLAGGED — HIGH RISK
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {bidder.bids} bid{bidder.bids > 1 ? "s" : ""} submitted &bull; Tenders: {bidder.tenders.join(", ")}
                        </p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 ${riskColor(bidder.highestRisk)}`}>
                        {bidder.highestRisk === "High" && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {bidder.highestRisk} Risk
                      </Badge>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                      {/* Score */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-center">
                        <p className={`text-2xl font-extrabold ${scoreColor(bidder.avgScore)}`}>{bidder.avgScore}%</p>
                        <p className="text-xs text-slate-500 font-medium">Avg. Compliance</p>
                        <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bidder.avgScore >= 70 ? "bg-green-500" : bidder.avgScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${bidder.avgScore}%` }}
                          />
                        </div>
                      </div>

                      {/* GSTN */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500 font-medium mb-1">GSTN Status</p>
                        <div className="flex items-center gap-1.5">
                          {apiStatusIcon(bidder.gstnStatus)}
                          <span className={`text-sm font-bold ${bidder.gstnStatus === "Verified" ? "text-green-700" : "text-red-600"}`}>
                            {bidder.gstnStatus}
                          </span>
                        </div>
                      </div>

                      {/* PAN */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500 font-medium mb-1">PAN Status</p>
                        <div className="flex items-center gap-1.5">
                          {apiStatusIcon(bidder.panStatus)}
                          <span className={`text-sm font-bold ${bidder.panStatus === "Verified" ? "text-green-700" : "text-red-600"}`}>
                            {bidder.panStatus}
                          </span>
                        </div>
                      </div>

                      {/* Turnover */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500 font-medium mb-1">Turnover</p>
                        <p className="text-sm font-bold text-blue-700 flex items-center gap-0.5">
                          <IndianRupee className="h-3 w-3" />{bidder.financialTurnover}
                        </p>
                      </div>
                    </div>

                    {/* Flagged Warning Box */}
                    {bidder.everFlagged && (
                      <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-3 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <span className="font-bold">Risk Warning:</span> This company was previously flagged by the AI Verification Engine for document tampering or statutory data mismatches. Exercise extreme caution when evaluating bids from this entity.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Button */}
                  <div className="shrink-0 pt-1">
                    <Link href={`/officer/tenders/${bidder.tenders[0]}`}>
                      <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                        <Eye className="mr-1.5 h-4 w-4" /> View Bids
                      </Button>
                    </Link>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800 font-medium">
          Rankings are auto-calculated by the AI engine based on compliance scores across all submitted bids.
          All data is <span className="font-bold">immutable and cryptographically logged</span> in the Audit Trail.
        </p>
      </div>

    </div>
  );
}
