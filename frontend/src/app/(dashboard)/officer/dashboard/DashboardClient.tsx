"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Users, AlertTriangle, ShieldCheck, ArrowRight, Clock, CheckCircle, XCircle, Activity, Eye } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

type DashboardClientProps = {
  activeTenders: any[];
  pendingBids: any[];
  highRiskBids: any[];
  allBidders: any[];
  tenderData: any[];
};

// Mock recent activity — will connect to audit log backend later
const recentActivity = [
  { id: 1, event: "AI Analysis Completed", detail: "TND-2026-001 · Sharma Enterprises", time: "2 min ago", type: "info" },
  { id: 2, event: "High-Risk Flag Raised", detail: "TND-2026-003 · XYZ Traders — GSTIN mismatch", time: "18 min ago", type: "danger" },
  { id: 3, event: "Bid Submitted", detail: "TND-2026-002 · Infra Solutions Pvt. Ltd.", time: "45 min ago", type: "info" },
  { id: 4, event: "Document Tampering Detected", detail: "TND-2026-003 · XYZ Traders — PDF metadata altered", time: "1 hr ago", type: "danger" },
  { id: 5, event: "Audit Log Finalised", detail: "TND-2026-001 · Sent to CVC", time: "3 hrs ago", type: "success" },
];

// Mock high-risk flagged bidders
const flaggedBidders = [
  { id: "BID-003", company: "XYZ Traders", tender: "TND-2026-003", issue: "Document tampering + GSTIN mismatch", score: 22 },
  { id: "BID-007", company: "Fake Infra Co.", tender: "TND-2026-001", issue: "PAN does not match MCA records", score: 15 },
];

export default function DashboardClient({
  activeTenders, pendingBids, highRiskBids, allBidders, tenderData
}: DashboardClientProps) {

  const riskData = [
    { name: "Low Risk",    value: allBidders.filter(b => b.riskTag === "Low").length,    color: "#10b981" },
    { name: "Medium Risk", value: allBidders.filter(b => b.riskTag === "Medium").length, color: "#fbbf24" },
    { name: "High Risk",   value: highRiskBids.length,                                   color: "#ef4444" },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Procurement Overview</h2>
          <p className="text-slate-500 mt-1 text-sm">Monitor active tenders and bid compliance across all departments. <span className="font-semibold text-blue-700">Read-only view.</span></p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1 font-semibold">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> System Operational
        </Badge>
      </div>

      {/* ⚠️ HIGH RISK ALERT BANNER */}
      {flaggedBidders.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <h3 className="font-bold text-red-800 text-base">
              {flaggedBidders.length} High-Risk Bid{flaggedBidders.length > 1 ? "s" : ""} Require Immediate Attention
            </h3>
          </div>
          <div className="divide-y divide-red-200">
            {flaggedBidders.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 gap-4">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-red-500 font-semibold">{b.tender}</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">⚠ FLAGGED</Badge>
                  </div>
                  <p className="font-bold text-red-900">{b.company}</p>
                  <p className="text-sm text-red-700">{b.issue}</p>
                </div>
                <div className="text-center shrink-0">
                  <p className="text-2xl font-extrabold text-red-600">{b.score}%</p>
                  <p className="text-xs text-red-500 font-medium">AI Score</p>
                </div>
                <Link href={`/officer/tenders/${b.tender}`}>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 shrink-0">
                    <Eye className="mr-1.5 h-4 w-4" /> Review
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Tenders</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeTenders.length || 5}</div>
            <p className="text-xs text-blue-700 font-medium mt-1">+2 this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingBids.length || 8}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Across all tenders</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">High-Risk Flags</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{flaggedBidders.length}</div>
            <p className="text-xs text-red-600 font-semibold mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {Math.round((allBidders.filter(b => b.riskTag === "Low").length / (allBidders.length || 1)) * 100) || 74}%
            </div>
            <p className="text-xs text-green-700 font-medium mt-1">AI-verified bids</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-7">

        {/* Bar Chart */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader className="border-b pb-4 bg-slate-50">
            <CardTitle className="text-base font-bold text-slate-800">Bids per Tender</CardTitle>
            <CardDescription className="text-xs text-slate-500">Volume of applications received per active tender.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenderData.length ? tenderData : [
                { name: "TND-001", bids: 4 }, { name: "TND-002", bids: 7 },
                { name: "TND-003", bids: 2 }, { name: "TND-004", bids: 5 }, { name: "TND-005", bids: 3 },
              ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                <Bar dataKey="bids" fill="#1d4ed8" radius={[4, 4, 0, 0]} animationDuration={1500} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader className="border-b pb-4 bg-slate-50">
            <CardTitle className="text-base font-bold text-slate-800">Risk Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-500">AI-assessed risk levels across all submitted bids.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData.some(r => r.value > 0) ? riskData : [
                    { name: "Low Risk", value: 12, color: "#10b981" },
                    { name: "Medium Risk", value: 5, color: "#fbbf24" },
                    { name: "High Risk", value: 2, color: "#ef4444" },
                  ]}
                  cx="50%" cy="45%" innerRadius={80} outerRadius={110}
                  paddingAngle={3} dataKey="value" animationDuration={1500}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4 bg-slate-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" /> Recent Activity
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">Live feed of AI verifications and system events.</CardDescription>
          </div>
          <Link href="/officer/audit">
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 text-xs hover:bg-slate-50">
              View Full Audit Log <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                item.type === "danger"  ? "bg-red-100"   :
                item.type === "success" ? "bg-green-100" : "bg-blue-100"
              }`}>
                {item.type === "danger"  && <XCircle    className="h-4 w-4 text-red-600"   />}
                {item.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                {item.type === "info"    && <Activity    className="h-4 w-4 text-blue-600"  />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{item.event}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/officer/tenders">
          <Card className="shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Manage Tenders</p>
                <p className="text-sm text-slate-500">View all active tenders and review bids</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/officer/bidders">
          <Card className="shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer border-dashed">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Bidder Directory</p>
                <p className="text-sm text-slate-500">View ranked profiles and risk flags</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
            </CardContent>
          </Card>
        </Link>
      </div>

    </div>
  );
}
