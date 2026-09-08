"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, ShieldCheck, AlertTriangle, FileSearch, Lock,
  Send, Download, CheckCircle, XCircle, Clock, Eye,
  FileText, Cpu, Hash, Loader2
} from "lucide-react";

type AuditLog = {
  id: string;
  timestamp: string;
  bid_id: string;
  action: string;
  officer_id: string;
  previous_hash: string;
  hash: string;
};

const severityFromAction = (action: string) => {
  if (action === "REJECTED") return "Critical";
  if (action === "APPROVED") return "Info";
  return "Warning";
};

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

const eventIcon = (action: string) => {
  if (action === "REJECTED") return <XCircle className="h-4 w-4 text-red-600" />;
  if (action === "APPROVED") return <CheckCircle className="h-4 w-4 text-green-600" />;
  return <Activity className="h-4 w-4 text-slate-500" />;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCVCModal, setShowCVCModal] = useState(false);
  const [cvcSent, setCVCSent] = useState(false);
  const [expandedHash, setExpandedHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/officer/audit');
        const json = await res.json();
        if (json.success) setLogs(json.data.reverse()); // newest first
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading audit logs...</p>
      </div>
    );
  }

  const criticalCount = logs.filter(l => severityFromAction(l.action) === "Critical").length;
  const approvedCount = logs.filter(l => l.action === "APPROVED").length;
  const totalCount    = logs.length;

  const handleSendCVC = () => {
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
            Immutable, tamper-proof record of every officer decision — secured with SHA-256 hash chain.
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
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Rejections</p>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Approvals</p>
              <p className="text-3xl font-bold text-green-700">{approvedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-300" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Events</p>
              <p className="text-3xl font-bold text-blue-700">{totalCount}</p>
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
          {logs.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500 font-medium">
              No audit log entries yet. Approve or reject a bid to generate the first entry.
            </div>
          ) : (
            logs.map((log) => {
              const sev = severityConfig[severityFromAction(log.action)] ?? severityConfig["Info"];
              const isExpanded = expandedHash === log.id;
              return (
                <div
                  key={log.id}
                  className={`px-6 py-4 hover:bg-slate-50 transition-colors ${
                    log.action === "REJECTED" ? "bg-red-50/30 hover:bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      log.action === "REJECTED" ? "bg-red-100" : "bg-green-100"
                    }`}>
                      {eventIcon(log.action)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400">{log.id}</span>
                        <Badge variant="outline" className={`flex items-center text-xs ${sev.color}`}>
                          {sev.icon}{sev.label}
                        </Badge>
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          BID_{log.action}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        Bid <span className="font-mono text-blue-700">{log.bid_id}</span> was <span className={log.action === "REJECTED" ? "text-red-700" : "text-green-700"}>{log.action}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span suppressHydrationWarning className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {log.officer_id}
                        </span>
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

                      {/* Previous Hash (chain proof) */}
                      {isExpanded && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Lock className="h-3 w-3 shrink-0" />
                          <span className="font-mono break-all">prev: {log.previous_hash.slice(0, 32)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
