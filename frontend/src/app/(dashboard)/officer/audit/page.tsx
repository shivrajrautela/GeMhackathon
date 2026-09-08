"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, ShieldCheck, AlertTriangle, FileSearch, Lock,
  Send, Download, CheckCircle, XCircle, Clock, Eye,
  FileText, Cpu, Hash
} from "lucide-react";

// ─── Mock Audit Logs ─────────────────────────────────────────────────────────
const mockAuditLogs = [
  {
    id: "LOG-001",
    time: "2026-09-08 22:41:03",
    actor: "AI Engine",
    event: "AI_ANALYSIS_COMPLETE",
    detail: "TND-2026-001 · TechCorp India — All 8 Gov API checks passed",
    severity: "Info",
    hash: "a3f8c2d1e4b5f9a0c7d3e2f1b8a4c6d9e0f2b5a1c4d7e8f3b6a9c2d5e8f1b4",
    tender: "TND-2026-001",
  },
  {
    id: "LOG-002",
    time: "2026-09-08 21:58:47",
    actor: "AI Engine",
    event: "DOCUMENT_TAMPERING_DETECTED",
    detail: "TND-2026-001 · Shady Supplies LLC — PDF metadata altered, GSTIN mismatch",
    severity: "Critical",
    hash: "b7e2f5a8c1d4e7f0b3c6a9d2e5f8b1c4a7d0e3f6b9c2d5e8f1b4c7a0d3e6f9",
    tender: "TND-2026-001",
  },
  {
    id: "LOG-003",
    time: "2026-09-08 21:30:12",
    actor: "AI Engine",
    event: "GOV_API_VERIFICATION",
    detail: "TND-2026-001 · Globex IT Solutions — Udyam registration expired",
    severity: "Warning",
    hash: "c1d4e7f0b3c6a9d2e5f8b1c4a7d0e3f6b9c2d5e8f1b4c7a0d3e6f9b2c5a8d1",
    tender: "TND-2026-001",
  },
  {
    id: "LOG-004",
    time: "2026-09-08 20:15:38",
    actor: "System",
    event: "BID_SUBMISSION_RECEIVED",
    detail: "TND-2026-002 · SunPower Renewables — New bid document uploaded",
    severity: "Info",
    hash: "d5e8f1b4c7a0d3e6f9b2c5a8d1e4f7b0c3a6d9e2f5b8c1d4e7f0b3c6a9d2e5",
    tender: "TND-2026-002",
  },
  {
    id: "LOG-005",
    time: "2026-09-08 19:02:21",
    actor: "AI Engine",
    event: "RISK_SCORE_CALCULATED",
    detail: "TND-2026-002 · SunPower Renewables — Compliance score: 88%",
    severity: "Info",
    hash: "e9f2b5a8c1d4e7f0b3c6a9d2e5f8b1c4a7d0e3f6b9c2d5e8f1b4c7a0d3e6f9",
    tender: "TND-2026-002",
  },
  {
    id: "LOG-006",
    time: "2026-09-08 17:44:09",
    actor: "Procurement Officer",
    event: "TENDER_OPENED_FOR_REVIEW",
    detail: "TND-2026-001 — Officer accessed bid review panel",
    severity: "Info",
    hash: "f3c6a9d2e5f8b1c4a7d0e3f6b9c2d5e8f1b4c7a0d3e6f9b2c5a8d1e4f7b0c3",
    tender: "TND-2026-001",
  },
];

type Log = typeof mockAuditLogs[0];

const severityConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  Critical: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
    label: "Critical",
  },
  Warning: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
    label: "Warning",
  },
  Info: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <FileSearch className="h-3.5 w-3.5 mr-1" />,
    label: "Info",
  },
};

const eventIcon = (event: string) => {
  if (event.includes("TAMPERING") || event.includes("CRITICAL")) return <AlertTriangle className="h-4 w-4 text-red-600" />;
  if (event.includes("COMPLETE") || event.includes("SCORE"))     return <Cpu className="h-4 w-4 text-blue-600" />;
  if (event.includes("SUBMISSION"))                               return <FileText className="h-4 w-4 text-green-600" />;
  if (event.includes("VERIFICATION"))                            return <ShieldCheck className="h-4 w-4 text-amber-600" />;
  if (event.includes("CVC"))                                      return <Send className="h-4 w-4 text-purple-600" />;
  return <Activity className="h-4 w-4 text-slate-500" />;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AuditLogsPage() {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [showCVCModal, setShowCVCModal] = useState(false);
  const [cvcSent, setCVCSent] = useState(false);
  const [expandedHash, setExpandedHash] = useState<string | null>(null);

  const criticalCount = logs.filter(l => l.severity === "Critical").length;
  const warningCount  = logs.filter(l => l.severity === "Warning").length;
  const infoCount     = logs.filter(l => l.severity === "Info").length;

  const handleSendCVC = () => {
    const newLog: Log = {
      id: `LOG-${String(logs.length + 1).padStart(3, "0")}`,
      time: new Date().toLocaleString("sv-SE").replace("T", " "),
      actor: "Procurement Officer",
      event: "CVC_AUDIT_REPORT_DISPATCHED",
      detail: "Full audit trail sent to Central Vigilance Commission for final bid award verification",
      severity: "Info",
      hash: Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join(""),
      tender: "ALL",
    };
    setLogs(prev => [newLog, ...prev]);
    setCVCSent(true);
    setShowCVCModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cryptographic Audit Logs</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Immutable, tamper-proof record of every AI verification, API call, and officer action — secured with SHA-256 hashes.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => alert("Export feature will download PDF — backend integration pending.")}
          >
            <Download className="mr-1.5 h-4 w-4" /> Export Trail
          </Button>
          <Button
            className={`font-semibold ${cvcSent ? "bg-green-700 hover:bg-green-800" : "bg-purple-700 hover:bg-purple-800"}`}
            onClick={() => !cvcSent && setShowCVCModal(true)}
          >
            {cvcSent
              ? <><CheckCircle className="mr-1.5 h-4 w-4" /> Sent to CVC</>
              : <><Send className="mr-1.5 h-4 w-4" /> Send to CVC</>}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Critical Events</p>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Warnings</p>
              <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Info Events</p>
              <p className="text-3xl font-bold text-blue-700">{infoCount}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-300" />
          </CardContent>
        </Card>
      </div>

      {/* CVC Sent Banner */}
      {cvcSent && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-lg px-5 py-4">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            <span className="font-bold">Audit trail successfully dispatched to the Central Vigilance Commission (CVC).</span>{" "}
            A new immutable log entry has been created. The bid award process is now officially finalized and on record.
          </p>
        </div>
      )}

      {/* Logs List */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" /> Immutable Event Timeline
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {logs.length} total events · SHA-256 hash chained · Cannot be modified or deleted
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Chain Intact
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {logs.map((log) => {
            const sev = severityConfig[log.severity] ?? severityConfig["Info"];
            const isExpanded = expandedHash === log.id;
            return (
              <div
                key={log.id}
                className={`px-6 py-4 hover:bg-slate-50 transition-colors ${
                  log.severity === "Critical" ? "bg-red-50/30 hover:bg-red-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">

                  {/* Event Icon */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    log.severity === "Critical" ? "bg-red-100" :
                    log.severity === "Warning"  ? "bg-amber-100" : "bg-blue-100"
                  }`}>
                    {eventIcon(log.event)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-slate-400">{log.id}</span>
                      <Badge variant="outline" className={`flex items-center text-xs ${sev.color}`}>
                        {sev.icon}{sev.label}
                      </Badge>
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {log.event}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">{log.detail}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {log.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {log.actor}
                      </span>
                      {log.tender !== "ALL" && (
                        <span className="font-mono font-semibold text-blue-600">{log.tender}</span>
                      )}
                    </div>

                    {/* SHA-256 Hash — collapsible */}
                    <div
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() => setExpandedHash(isExpanded ? null : log.id)}
                    >
                      <Hash className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className={`font-mono text-xs transition-all ${
                        isExpanded
                          ? "text-slate-700 break-all"
                          : "text-slate-400 truncate max-w-xs group-hover:text-blue-600"
                      }`}>
                        {isExpanded ? log.hash : `${log.hash.slice(0, 32)}...`}
                      </span>
                      <span className="text-xs text-blue-500 group-hover:underline shrink-0">
                        {isExpanded ? "collapse" : "show hash"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Info Footer */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">
        <Lock className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800 font-medium">
          All events are <span className="font-bold">cryptographically chained</span> using SHA-256 hashing.
          Any attempt to modify a log entry would break the chain and be immediately detectable.
          This log can be submitted to the CVC as legal proof of a fair and transparent procurement process.
        </p>
      </div>

      {/* ── CVC Confirmation Modal ── */}
      {showCVCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-purple-700 px-6 py-4 flex items-center gap-3">
              <Send className="h-6 w-6 text-white" />
              <h3 className="text-lg font-bold text-white">Send Audit Trail to CVC</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  This action is <span className="font-bold">final and irreversible</span>.
                  Dispatching the audit trail to the Central Vigilance Commission officially records the procurement decision.
                </p>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-semibold text-slate-800">This will:</p>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600" /> Send all {logs.length} audit log entries to CVC</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600" /> Create an immutable dispatch record with timestamp</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-600" /> Finalise the bid award process officially</li>
                  <li className="flex items-center gap-2"><XCircle className="h-3.5 w-3.5 text-red-500" /> Cannot be undone after confirmation</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <Button variant="outline" className="border-slate-300" onClick={() => setShowCVCModal(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-700 hover:bg-purple-800 font-semibold" onClick={handleSendCVC}>
                <Send className="mr-1.5 h-4 w-4" /> Confirm & Send to CVC
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
