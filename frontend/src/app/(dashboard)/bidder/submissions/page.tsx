"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Clock, CheckCircle, XCircle, AlertTriangle,
  Calendar, IndianRupee, Building, Eye, ArrowRight
} from "lucide-react";

// Mock submissions — will connect to backend later
const mySubmissions = [
  {
    id: "APP-001",
    tenderId: "TND-2026-001",
    tenderTitle: "Supply of Office Furniture",
    department: "Ministry of Education",
    value: "₹45 Lakhs",
    submittedOn: "05 Sep 2026",
    deadline: "30 Sep 2026",
    status: "Under Review",
    aiScore: 82,
    flags: [],
  },
  {
    id: "APP-002",
    tenderId: "TND-2026-002",
    tenderTitle: "IT Infrastructure Upgrade – DRDO",
    department: "DRDO",
    value: "₹1.2 Crore",
    submittedOn: "06 Sep 2026",
    deadline: "10 Oct 2026",
    status: "Approved",
    aiScore: 95,
    flags: [],
  },
  {
    id: "APP-003",
    tenderId: "TND-2026-003",
    tenderTitle: "Stationery & Printing Materials",
    department: "Ministry of Finance",
    value: "₹8 Lakhs",
    submittedOn: "07 Sep 2026",
    deadline: "15 Oct 2026",
    status: "Rejected",
    aiScore: 34,
    flags: ["Document tampering detected", "GSTIN mismatch"],
  },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Under Review": {
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5 mr-1" />,
  },
  Approved: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
  },
  Rejected: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
  },
};

const scoreColor = (score: number) => {
  if (score >= 70) return "text-green-700";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
};

export default function MySubmissionsPage() {
  const approvedCount = mySubmissions.filter(s => s.status === "Approved").length;
  const reviewCount = mySubmissions.filter(s => s.status === "Under Review").length;
  const rejectedCount = mySubmissions.filter(s => s.status === "Rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Submissions</h2>
        <p className="text-slate-500 mt-1">Track the status of all your bid applications and AI compliance scores.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Approved</p>
              <p className="text-3xl font-bold text-slate-900">{approvedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Under Review</p>
              <p className="text-3xl font-bold text-slate-900">{reviewCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Rejected</p>
              <p className="text-3xl font-bold text-slate-900">{rejectedCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      {mySubmissions.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <FileText className="h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700">No submissions yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">You haven't applied to any tenders. Browse open tenders and submit your first bid.</p>
            <Link href="/bidder/apply">
              <Button className="bg-blue-700 hover:bg-blue-800">
                Browse Tenders <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mySubmissions.map((sub) => {
            const config = statusConfig[sub.status];
            return (
              <Card key={sub.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400 font-semibold">{sub.tenderId}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-xs text-blue-600 font-semibold">{sub.id}</span>
                        <Badge variant="outline" className={`flex items-center ${config.color}`}>
                          {config.icon}{sub.status}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900">{sub.tenderTitle}</h3>

                      {/* Meta */}
                      <div className="flex items-center gap-5 text-sm text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" /> {sub.department}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-blue-700">
                          <IndianRupee className="h-4 w-4" /> {sub.value}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> Submitted: <span className="font-semibold text-slate-700">{sub.submittedOn}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Deadline: <span className="font-semibold text-slate-700">{sub.deadline}</span>
                        </span>
                      </div>

                      {/* AI Compliance Score */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 font-medium">AI Compliance Score:</span>
                        <span className={`text-lg font-extrabold ${scoreColor(sub.aiScore)}`}>{sub.aiScore}%</span>
                        <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sub.aiScore >= 70 ? "bg-green-500" : sub.aiScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${sub.aiScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Flags (if any) */}
                      {sub.flags.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-1">
                          <p className="text-xs font-bold text-red-700 uppercase tracking-wide flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Issues Found by AI
                          </p>
                          {sub.flags.map((flag, i) => (
                            <p key={i} className="text-sm text-red-700">• {flag}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Link href={`/bidder/apply/${sub.tenderId}`}>
                        <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                          <Eye className="mr-1.5 h-4 w-4" /> View
                        </Button>
                      </Link>
                      {sub.status === "Rejected" && (
                        <Link href={`/bidder/apply/${sub.tenderId}`}>
                          <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                            Re-apply <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Browse More */}
      <div className="flex justify-center pt-2">
        <Link href="/bidder/apply">
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
            Browse More Tenders <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
