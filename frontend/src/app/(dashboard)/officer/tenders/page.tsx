"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTenders } from "@/lib/mock-data";
import {
  Eye, FileText, AlertTriangle, Clock, CheckCircle,
  IndianRupee, Calendar, Users, ShieldCheck, Building
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  "Active": {
    label: "Active",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="h-3 w-3 mr-1" />,
  },
  "Under Review": {
    label: "Under Review",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3 mr-1" />,
  },
  "Closed": {
    label: "Closed",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: <FileText className="h-3 w-3 mr-1" />,
  },
};

const riskBadge = (score: number) => {
  if (score < 30) return "bg-green-50 text-green-700 border-green-200";
  if (score < 60) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};

const riskLabel = (score: number) => {
  if (score < 30) return "Low";
  if (score < 60) return "Medium";
  return "High";
};

export default function OfficerTenders() {
  const activeTenders    = mockTenders.filter(t => t.status === "Active");
  const underReview      = mockTenders.filter(t => t.status === "Under Review");
  const closedTenders    = mockTenders.filter(t => t.status === "Closed");
  const totalBids        = mockTenders.reduce((sum, t) => sum + t.bidsCount, 0);
  const highRiskTenders  = mockTenders.filter(t => t.avgRiskScore >= 60);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tender Management</h2>
          <p className="text-slate-500 mt-1 text-sm">
            View all department tenders and review submitted bids.{" "}
            <span className="font-semibold text-blue-700">Read-only view — no modifications allowed.</span>
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 font-semibold mt-1">
          <FileText className="mr-1.5 h-3.5 w-3.5" /> {mockTenders.length} Total Tenders
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Active</p>
              <p className="text-3xl font-bold text-slate-900">{activeTenders.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Under Review</p>
              <p className="text-3xl font-bold text-slate-900">{underReview.length}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Bids</p>
              <p className="text-3xl font-bold text-slate-900">{totalBids}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">High-Risk</p>
              <p className="text-3xl font-bold text-red-600">{highRiskTenders.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
      </div>

      {/* Tenders Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-base font-bold text-slate-800">All Tenders</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Click <span className="font-semibold text-blue-700">"Review Bids"</span> on any tender to open the AI Verification Center.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-600">Tender ID</TableHead>
                <TableHead className="font-semibold text-slate-600">Title & Department</TableHead>
                <TableHead className="font-semibold text-slate-600">Budget</TableHead>
                <TableHead className="font-semibold text-slate-600">Deadline</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 text-center">Bids</TableHead>
                <TableHead className="font-semibold text-slate-600 text-center">Avg. Risk</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenders.map((tender) => {
                const status = statusConfig[tender.status] || statusConfig["Active"];
                const isHighRisk = tender.avgRiskScore >= 60;
                return (
                  <TableRow
                    key={tender.id}
                    className={`hover:bg-slate-50 transition-colors ${isHighRisk ? "bg-red-50/30" : ""}`}
                  >
                    {/* Tender ID */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs font-bold text-slate-700">{tender.id}</span>
                        {isHighRisk && (
                          <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                            <AlertTriangle className="h-3 w-3" /> High Risk
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 text-sm">{tender.title}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Building className="h-3 w-3" /> {tender.department}
                        </span>
                      </div>
                    </TableCell>

                    {/* Budget */}
                    <TableCell>
                      <span className="font-semibold text-blue-700 text-sm flex items-center gap-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {tender.budget}
                      </span>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {tender.deadline}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant="outline" className={`flex items-center w-fit ${status.color}`}>
                        {status.icon}{status.label}
                      </Badge>
                    </TableCell>

                    {/* Bids Count */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800">{tender.bidsCount}</span>
                      </div>
                    </TableCell>

                    {/* Avg Risk */}
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant="outline" className={riskBadge(tender.avgRiskScore)}>
                          {riskLabel(tender.avgRiskScore)} · {tender.avgRiskScore}%
                        </Badge>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tender.avgRiskScore < 30 ? "bg-green-500" :
                              tender.avgRiskScore < 60 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${tender.avgRiskScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Link href={`/officer/tenders/${tender.id}`}>
                        <Button
                          size="sm"
                          className={`${
                            isHighRisk
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-700 hover:bg-blue-800"
                          } text-white`}
                        >
                          <Eye className="mr-1.5 h-4 w-4" />
                          {isHighRisk ? "Urgent Review" : "Review Bids"}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800 font-medium">
          All bid data is <span className="font-bold">immutable and cryptographically secured</span>. Officers can view and run AI analysis, but cannot modify any submitted information.
        </p>
      </div>

    </div>
  );
}
