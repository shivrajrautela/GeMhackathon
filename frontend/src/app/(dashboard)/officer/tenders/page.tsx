"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, FileText, AlertTriangle, Clock, CheckCircle,
  IndianRupee, Calendar, Users, ShieldCheck, Building, Loader2
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
  if (score >= 70) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};

const riskLabel = (score: number) => {
  if (score >= 70) return "Low";
  if (score >= 40) return "Medium";
  return "High";
};

export default function OfficerTenders() {
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState<any[]>([]);
  const [allBids, setAllBids] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tendersRes, bidsRes] = await Promise.all([
          fetch('http://localhost:5000/api/tenders'),
          fetch('http://localhost:5000/api/officer/bids')
        ]);
        
        const tendersJson = await tendersRes.json();
        const bidsJson = await bidsRes.json();

        let bidsList = [];
        if (bidsJson.success) bidsList = bidsJson.data;
        
        let tendersList = [];
        if (tendersJson.success) {
          tendersList = tendersJson.data.map((t: any) => {
            const tenderBids = bidsList.filter((b: any) => b.tender_id === t.id);
            const scoredBids = tenderBids.filter((b: any) => b.aiScore > 0);
            
            let avgRiskScore = 100;
            if (scoredBids.length > 0) {
              avgRiskScore = Math.round(scoredBids.reduce((acc: number, b: any) => acc + b.aiScore, 0) / scoredBids.length);
            } else if (tenderBids.length === 0) {
              avgRiskScore = 0;
            }

            return {
              ...t,
              bidsCount: tenderBids.length,
              avgRiskScore
            };
          });
        }

        setTenders(tendersList);
        setAllBids(bidsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading tenders...</p>
      </div>
    );
  }

  const activeTenders    = tenders.filter(t => t.status !== "Closed");
  const closedTenders    = tenders.filter(t => t.status === "Closed");
  const totalBids        = allBids.length;
  const highRiskTenders  = tenders.filter(t => t.avgRiskScore > 0 && t.avgRiskScore < 40);

  return (
    <div className="space-y-6 pb-10">

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
          <FileText className="mr-1.5 h-3.5 w-3.5" /> {tenders.length} Total Tenders
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
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">High-Risk Tenders</p>
              <p className="text-3xl font-bold text-slate-900">{highRiskTenders.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Closed</p>
              <p className="text-3xl font-bold text-slate-900">{closedTenders.length}</p>
            </div>
            <FileText className="h-8 w-8 text-slate-400" />
          </CardContent>
        </Card>
      </div>

      {/* Tenders Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Tender Directory</CardTitle>
              <CardDescription>Select a tender to view its submitted bids and AI compliance reports.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[120px] font-semibold text-slate-600">ID</TableHead>
                <TableHead className="font-semibold text-slate-600">Tender Details</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Bids</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">Avg Compliance</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => {
                const conf = statusConfig[tender.status] || statusConfig["Active"];
                return (
                  <TableRow key={tender.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-sm font-semibold text-slate-600 align-top">
                      {tender.id}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 line-clamp-1">{tender.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {tender.department}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {tender.budget}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline: {tender.deadline}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline" className={conf.color}>
                        {conf.icon} {conf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <div className="inline-flex items-center justify-center bg-slate-100 text-slate-700 rounded-full h-8 w-8 font-bold text-sm">
                        {tender.bidsCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-center align-top">
                      {tender.bidsCount > 0 ? (
                        <div className="flex flex-col items-center space-y-1">
                          <Badge variant="outline" className={riskBadge(tender.avgRiskScore)}>
                            {tender.avgRiskScore}% Score
                          </Badge>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {riskLabel(tender.avgRiskScore)} Risk
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm font-medium">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Link href={`/officer/tenders/${tender.id}`}>
                        <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                          <Eye className="mr-1.5 h-4 w-4" /> View Bids
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {tenders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No tenders found.
                  </TableCell>
                </TableRow>
              )}
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
