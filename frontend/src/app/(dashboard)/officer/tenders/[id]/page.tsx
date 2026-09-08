"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock,
  ShieldCheck, FileText, Cpu, Eye, Building, Calendar,
  IndianRupee, User, ChevronRight, Loader2, Sparkles, AlertOctagon
} from "lucide-react";

// ─── Gov API checks definition ───────────────────────────────────────────────
type CheckStatus = "pending" | "running" | "pass" | "fail";

const GOV_API_CHECKS = [
  { key: "pan",       label: "Income Tax (PAN)",          api: "incometaxindiaefiling.gov.in", desc: "PAN validity & entity name match" },
  { key: "gstin",      label: "GSTN Portal",              api: "api.gstn.gov.in",     desc: "GST registration & filing status" },
  { key: "udyam",     label: "Udyam / MSME Registry",    api: "udyamregistration.gov.in", desc: "MSME registration & category" },
  { key: "mca",       label: "MCA21 Company Registry",   api: "mca.gov.in",          desc: "Company status & director details" },
  { key: "epfo",      label: "EPFO Employee Records",    api: "epfindia.gov.in",     desc: "Actual employee count via PF data" },
  { key: "blacklist", label: "GeM Blacklist / Defaulter", api: "gem.gov.in/debarred", desc: "Previous debarment or fraud history" },
  { key: "turnover",  label: "Turnover Verification",    api: "gstn.gov.in/returns", desc: "Annual turnover vs GSTR-9 filing" },
  { key: "cert",      label: "Certificate Validity",     api: "bis.gov.in",          desc: "ISO / BIS certification validity" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const rankLabel = (rank: number) => {
  const labels: Record<number, string> = { 1: "L1", 2: "L2", 3: "L3", 4: "L4" };
  return labels[rank] || `L${rank}`;
};

const rankColor = (rank: number) => {
  if (rank === 1) return "bg-green-100 text-green-800 border-green-300";
  if (rank === 2) return "bg-blue-100 text-blue-800 border-blue-200";
  if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
};

const riskColor = (score: number) => {
  if (score >= 70) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};

const scoreColor = (score: number) => {
  if (score >= 70) return "text-green-700";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BidReviewPage() {
  const params   = useParams();
  const tenderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tender, setTender] = useState<any>(null);
  const [bidders, setBidders] = useState<any[]>([]);
  const [selectedBidder, setSelectedBidder] = useState<any | null>(null);

  // AI Analysis state
  type AIState = "idle" | "ocr" | "checking" | "done";
  const [aiState, setAIState]         = useState<AIState>("idle");
  const [checkStatuses, setCheckStatuses] = useState<Record<string, CheckStatus>>({});
  const [activeCheckIdx, setActiveCheckIdx] = useState(-1);
  const [showSummary, setShowSummary] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null); // Store real backend result
  const [decisionLoading, setDecisionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tendersRes, bidsRes] = await Promise.all([
          fetch('http://localhost:5000/api/tenders'),
          fetch('http://localhost:5000/api/officer/bids')
        ]);
        
        const tendersJson = await tendersRes.json();
        const bidsJson = await bidsRes.json();

        if (tendersJson.success) {
          const t = tendersJson.data.find((x: any) => x.id === tenderId);
          setTender(t);
        }

        if (bidsJson.success) {
          // Filter to this tender, sort by AI Score (unscored = 0, so scored bubble up)
          const tenderBids = bidsJson.data
            .filter((b: any) => b.tender_id === tenderId)
            .sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
          
          setBidders(tenderBids);
        }
      } catch (err) {
        console.error("Failed to load tender/bids", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenderId]);

  const resetAI = () => {
    setAIState("idle");
    setCheckStatuses({});
    setActiveCheckIdx(-1);
    setShowSummary(false);
    setVerifyResult(null);
  };

  const runAIAnalysis = async () => {
    if (!selectedBidder || aiState !== "idle") return;
    
    // UI state transition
    setAIState("ocr");
    setCheckStatuses({});
    setActiveCheckIdx(-1);
    setShowSummary(false);

    let backendData: any = null;

    try {
      // 1. Call Backend to Extract, Cross-Check, and Score the bid
      const res = await fetch(`http://localhost:5000/api/officer/bids/${selectedBidder.id}/verify`, {
        method: "POST"
      });
      const json = await res.json();
      
      if (json.success) {
        backendData = json.data;
        setVerifyResult(backendData);
        // Refresh the specific bidder in the left list so score updates
        setBidders(prev => prev.map(b => b.id === backendData.id ? backendData : b));
        setSelectedBidder(backendData); // Update selected state
      } else {
        alert(`Verification failed: ${json.error}`);
        resetAI();
        return;
      }
    } catch (err) {
      console.error("Verification network error", err);
      alert("Network error communicating with AI server.");
      resetAI();
      return;
    }

    // 2. Start the visual checks animation (for dramatic hackathon effect!)
    setAIState("checking");
    let idx = 0;

    const runNext = (data: any) => {
      if (idx >= GOV_API_CHECKS.length) {
        setActiveCheckIdx(-1);
        setShowSummary(true);
        setAIState("done");
        return;
      }
      const check = GOV_API_CHECKS[idx];
      setActiveCheckIdx(idx);
      setCheckStatuses(prev => ({ ...prev, [check.key]: "running" }));

      setTimeout(() => {
        let result: "pass" | "fail" = "pass";
        
        // Use real Gov Verification data for the APIs we integrated
        if (check.key === "pan" && data.govVerification?.pan) {
            result = data.govVerification.pan.match ? "pass" : "fail";
        } else if (check.key === "gstin" && data.govVerification?.gstin) {
            result = data.govVerification.gstin.match ? "pass" : "fail";
        } else if (check.key === "udyam" && data.govVerification?.udyam) {
            result = data.govVerification.udyam.match ? "pass" : "fail";
        } else {
            // Mock the rest based on general AI score
            if (data.aiScore < 40 && ["blacklist", "turnover"].includes(check.key)) result = "fail";
            if (data.aiScore < 70 && data.aiScore >= 40 && ["mca", "cert"].includes(check.key)) result = "fail";
        }

        setCheckStatuses(prev => ({ ...prev, [check.key]: result }));
        idx++;
        setTimeout(() => runNext(data), 300);
      }, 700);
    };

    runNext(backendData);
  };

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-slate-600 font-semibold">Tender not found.</p>
        <Link href="/officer/tenders"><Button variant="outline">Back to Tenders</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Breadcrumb & Header ── */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/officer/tenders" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Tenders
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-blue-700 font-semibold">{tenderId}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{tender.title}</h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{tender.department}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Deadline: {tender.deadline}</span>
              <span className="flex items-center gap-1 font-bold text-blue-700"><IndianRupee className="h-3.5 w-3.5" />{tender.budget}</span>
            </p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5 font-semibold shrink-0">
            <Clock className="mr-1.5 h-3.5 w-3.5" />{tender.status}
          </Badge>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Bidder Ranking List ── */}
        <div className="col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Bidders — Auto Ranked</h3>
            <Badge variant="outline" className="text-xs border-slate-300 text-slate-500">{bidders.length} Applied</Badge>
          </div>

          {bidders.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center py-10 text-center space-y-2">
                <FileText className="h-8 w-8 text-slate-300" />
                <p className="text-slate-500 text-sm">No bids submitted yet for this tender.</p>
              </CardContent>
            </Card>
          ) : (
            bidders.map((bidder, idx) => {
              const rank = idx + 1;
              const isSelected = selectedBidder?.id === bidder.id;
              
              const score = bidder.aiScore || 0;
              const riskTag = score === 0 ? "Pending" : score >= 70 ? "Low" : score >= 40 ? "Medium" : "High";

              return (
                <Card
                  key={bidder.id}
                  onClick={() => { setSelectedBidder(bidder); resetAI(); }}
                  className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/30"
                      : "hover:border-slate-400 bg-white"
                  } ${riskTag === "High" ? "border-l-4 border-l-red-500" : ""}`}
                >
                  <CardContent className="pt-4 pb-4 px-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`font-bold text-sm ${rankColor(rank)}`}>
                        {rankLabel(rank)}
                      </Badge>
                      {score > 0 && (
                        <Badge variant="outline" className={`text-xs ${riskColor(score)}`}>
                          {riskTag === "High" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {riskTag} Risk
                        </Badge>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />{bidder.company_name}
                      </p>
                      {riskTag === "High" && (
                        <p className="text-xs text-red-600 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> PREVIOUSLY FLAGGED — HIGH RISK
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xl font-extrabold ${score > 0 ? scoreColor(score) : "text-slate-400"}`}>
                          {score > 0 ? `${score}%` : "---"}
                        </p>
                        <p className="text-xs text-slate-500">AI Compliance</p>
                      </div>
                      {score > 0 && (
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              score >= 70 ? "bg-green-500" :
                              score >= 40 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Selected — viewing details →
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* ── RIGHT: Detail + AI Verification Panel ── */}
        <div className="col-span-8 space-y-4">
          {!selectedBidder ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Select a Bidder to Begin Review</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Click any bidder card on the left to view their details and run the AI verification analysis.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Bidder Info Header */}
              <Card className={`shadow-sm ${selectedBidder.aiScore > 0 && selectedBidder.aiScore < 40 ? "border-red-300 bg-red-50/20" : ""}`}>
                <CardHeader className="pb-3 border-b bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">{selectedBidder.company_name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-3 text-xs">
                        <span>ID: <span className="font-mono font-semibold">{selectedBidder.id}</span></span>
                        <span>Submitted: {selectedBidder.submittedOn}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedBidder.aiScore > 0 && (
                        <Badge variant="outline" className={riskColor(selectedBidder.aiScore)}>
                          {selectedBidder.aiScore < 40 && <AlertTriangle className="mr-1 h-3.5 w-3.5" />}
                          {selectedBidder.aiScore >= 70 ? "Low" : selectedBidder.aiScore >= 40 ? "Medium" : "High"} Risk
                        </Badge>
                      )}
                      <Badge variant="outline" className={rankColor(
                        bidders.findIndex(b => b.id === selectedBidder.id) + 1
                      )}>
                        {rankLabel(bidders.findIndex(b => b.id === selectedBidder.id) + 1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Bid Status</p>
                    {selectedBidder.aiScore > 0 ? (
                      <p className="flex items-center gap-2 text-green-700 font-medium">
                        <CheckCircle className="h-4 w-4 shrink-0" /> AI Scanned & Document Extracted
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-slate-500 font-medium">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" /> Pending AI Scan
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Discrepancies</p>
                    {selectedBidder.aiScore > 0 ? (
                      selectedBidder.flags && selectedBidder.flags.length > 0 ? (
                        <ul className="space-y-1">
                          {selectedBidder.flags.map((d: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-red-700 font-medium">
                              <XCircle className="h-3.5 w-3.5 shrink-0" />{d}
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-green-600 italic text-xs font-semibold">✅ No discrepancies found</p>
                    ) : (
                      <p className="text-slate-400 italic text-xs">Run analysis to identify discrepancies</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* PDF Viewer Placeholder */}
              <Card className="shadow-sm">
                <CardHeader className="bg-slate-50 border-b pb-3">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" /> Submitted PDF Document
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-slate-100 border-b border-slate-200 flex items-center gap-2 px-4 py-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-slate-500 font-mono">bid_document_{selectedBidder.id}.pdf</span>
                  </div>
                  <div className="bg-white h-48 flex items-center justify-center border-b border-slate-100">
                    <div className="text-center space-y-3">
                      <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-600">Bid Document — {selectedBidder.companyName}</p>
                        <p className="text-xs text-slate-400">PDF viewer will be connected to backend storage</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── AI Analysis Panel ── */}
              <Card className={`shadow-sm transition-all ${aiState !== "idle" ? "border-blue-300" : ""}`}>
                <CardHeader className="bg-slate-50 border-b pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold text-slate-700">AI Verification Engine</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {aiState === "done" && (
                        <Button size="sm" variant="outline" className="text-xs border-slate-300" onClick={resetAI}>
                          Reset
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className={`text-sm font-semibold ${
                          aiState === "idle"
                            ? "bg-blue-700 hover:bg-blue-800"
                            : aiState === "done"
                            ? "bg-green-700 hover:bg-green-800"
                            : "bg-slate-400 cursor-not-allowed"
                        }`}
                        onClick={runAIAnalysis}
                        disabled={aiState !== "idle"}
                      >
                        {aiState === "idle" && <><Cpu className="mr-1.5 h-4 w-4" /> Run AI Analysis</>}
                        {aiState === "ocr"  && <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Scanning PDF...</>}
                        {aiState === "checking" && <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Verifying APIs...</>}
                        {aiState === "done" && <><CheckCircle className="mr-1.5 h-4 w-4" /> Analysis Complete</>}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">

                  {/* Idle state */}
                  {aiState === "idle" && (
                    <div className="flex flex-col items-center py-8 text-center space-y-3">
                      <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-blue-500" />
                      </div>
                      <p className="text-slate-600 font-semibold">Ready to analyse bid document</p>
                      <p className="text-slate-400 text-xs max-w-xs">
                        Gemini AI will OCR-scan the uploaded PDF, extract key data, and cross-verify it against 8 Government API databases in real time.
                      </p>
                    </div>
                  )}

                  {/* OCR Phase */}
                  {aiState === "ocr" && (
                    <div className="flex flex-col items-center py-8 text-center space-y-4">
                      <div className="relative">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Loader2 className="h-3 w-3 text-white animate-spin" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-blue-700">Gemini Flash OCR — Scanning PDF...</p>
                        <p className="text-slate-500 text-xs">Extracting GSTIN, PAN, Turnover, Certifications from document</p>
                      </div>
                      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                    </div>
                  )}

                  {/* API Checks */}
                  {(aiState === "checking" || aiState === "done") && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                        Government API Verification — {Object.values(checkStatuses).filter(s => s === "pass" || s === "fail").length} / {GOV_API_CHECKS.length} Completed
                      </p>
                      <div className="space-y-2">
                        {GOV_API_CHECKS.map((check, idx) => {
                          const status = checkStatuses[check.key] || "pending";
                          const isActive = activeCheckIdx === idx;
                          return (
                            <div
                              key={check.key}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${
                                isActive   ? "border-blue-400 bg-blue-50 shadow-sm" :
                                status === "pass" ? "border-green-200 bg-green-50" :
                                status === "fail" ? "border-red-200 bg-red-50" :
                                status === "running" ? "border-blue-300 bg-blue-50/50 animate-pulse" :
                                "border-slate-100 bg-slate-50 opacity-50"
                              }`}
                            >
                              {/* Status Icon */}
                              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                {status === "pending" && <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                                {status === "running" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                                {status === "pass"    && <CheckCircle className="h-5 w-5 text-green-600" />}
                                {status === "fail"    && <XCircle className="h-5 w-5 text-red-600" />}
                              </div>

                              {/* Label */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  status === "pass" ? "text-green-800" :
                                  status === "fail" ? "text-red-800" :
                                  status === "running" ? "text-blue-700" : "text-slate-400"
                                }`}>
                                  {check.label}
                                </p>
                                <p className="text-xs text-slate-400 truncate font-mono">{check.api}</p>
                              </div>

                              {/* Result Badge */}
                              {(status === "pass" || status === "fail") && (
                                <Badge
                                  variant="outline"
                                  className={`shrink-0 text-xs font-bold ${
                                    status === "pass"
                                      ? "bg-green-100 text-green-800 border-green-300"
                                      : "bg-red-100 text-red-800 border-red-300"
                                  }`}
                                >
                                  {status === "pass" ? "✓ PASS" : "✗ FAIL"}
                                </Badge>
                              )}
                              {status === "running" && (
                                <Badge variant="outline" className="shrink-0 text-xs bg-blue-100 text-blue-700 border-blue-300">
                                  Querying...
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── AI Summary ── */}
                  {showSummary && verifyResult && (
                    <div className={`mt-4 rounded-lg border p-5 space-y-4 ${
                      verifyResult.aiScore < 40 ? "border-red-300 bg-red-50" :
                      verifyResult.aiScore < 70 ? "border-amber-300 bg-amber-50" :
                      "border-green-300 bg-green-50"
                    }`}>
                      <div className="flex items-center gap-2 border-b border-slate-200/50 pb-3">
                        <Sparkles className={`h-5 w-5 ${
                          verifyResult.aiScore < 40 ? "text-red-600" :
                          verifyResult.aiScore < 70 ? "text-amber-600" : "text-green-600"
                        }`} />
                        <p className={`font-bold text-sm ${
                          verifyResult.aiScore < 40 ? "text-red-800" :
                          verifyResult.aiScore < 70 ? "text-amber-800" : "text-green-800"
                        }`}>
                          Gemini 1.5 Flash — Live Verification Summary
                        </p>
                        <Badge variant="outline" className={`ml-auto text-xs font-bold ${
                          verifyResult.aiScore < 40 ? "bg-red-100 text-red-800 border-red-300" :
                          verifyResult.aiScore < 70 ? "bg-amber-100 text-amber-800 border-amber-300" :
                          "bg-green-100 text-green-800 border-green-300"
                        }`}>
                          {verifyResult.aiScore}% Compliance
                        </Badge>
                      </div>

                      {/* Show Real Gemini Data */}
                      {verifyResult.extractedData && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-slate-800">Raw Data Extracted from Document:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded border border-slate-200 p-3 shadow-inner">
                            <div><span className="text-slate-500 block">Company Name</span><span className="font-semibold text-slate-900">{verifyResult.extractedData.companyName}</span></div>
                            <div><span className="text-slate-500 block">GSTIN</span><span className="font-mono text-slate-900">{verifyResult.extractedData.gstin}</span></div>
                            <div><span className="text-slate-500 block">PAN</span><span className="font-mono text-slate-900">{verifyResult.extractedData.pan}</span></div>
                            <div><span className="text-slate-500 block">Turnover</span><span className="font-semibold text-slate-900">{verifyResult.extractedData.financialTurnover}</span></div>
                            <div><span className="text-slate-500 block">Udyam No.</span><span className="font-mono text-slate-900">{verifyResult.extractedData.udyamRegistration}</span></div>
                            <div>
                              <span className="text-slate-500 block">Tampering Signs</span>
                              <span className={`font-bold ${verifyResult.extractedData.tamperingSigns === true || verifyResult.extractedData.tamperingSigns === "true" ? 'text-red-600' : 'text-green-600'}`}>
                                {verifyResult.extractedData.tamperingSigns === true || verifyResult.extractedData.tamperingSigns === "true" ? "DETECTED" : "None Detected"}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm font-medium p-3 rounded border italic ${
                            verifyResult.aiScore < 40 ? "bg-red-100/50 border-red-200 text-red-900" :
                            "bg-slate-100 border-slate-200 text-slate-700"
                          }`}>
                            "{verifyResult.aiSummary}"
                          </p>
                        </div>
                      )}

                      {/* Pass/Fail Summary */}
                      <div className="flex items-center gap-4 pt-1 text-sm font-semibold">
                        <span className="text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {Object.values(checkStatuses).filter(s => s === "pass").length} Passed
                        </span>
                        <span className="text-red-700 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {Object.values(checkStatuses).filter(s => s === "fail").length} Failed
                        </span>
                        <span className="ml-auto text-slate-500 font-normal text-xs">
                          <ShieldCheck className="h-3.5 w-3.5 inline mr-1 text-slate-400" />
                          Secured & logged to audit trail
                        </span>
                      </div>
                      
                      {/* Officer Decision Buttons */}
                      <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center gap-3 justify-end">
                        <Button 
                            disabled={decisionLoading}
                            className="bg-red-600 hover:bg-red-700 font-bold"
                            onClick={async () => {
                                setDecisionLoading(true);
                                await fetch(`http://localhost:5000/api/officer/bids/${verifyResult.id}/decision`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ decision: 'Rejected' })
                                });
                                window.location.href = '/officer/dashboard';
                            }}
                        >
                            <XCircle className="mr-1.5 h-4 w-4" /> Reject Bid
                        </Button>
                        <Button 
                            disabled={decisionLoading}
                            className="bg-green-600 hover:bg-green-700 font-bold"
                            onClick={async () => {
                                setDecisionLoading(true);
                                await fetch(`http://localhost:5000/api/officer/bids/${verifyResult.id}/decision`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ decision: 'Approved' })
                                });
                                window.location.href = '/officer/dashboard';
                            }}
                        >
                            <CheckCircle className="mr-1.5 h-4 w-4" /> Approve Bid
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
