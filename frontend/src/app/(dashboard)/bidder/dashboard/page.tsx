"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UploadCloud, FileCheck, AlertTriangle, CheckCircle, Clock, ArrowRight, Building2 } from "lucide-react";

// Mock data — will connect to backend later
const mockStats = {
  activeBids: 2,
  pendingReview: 1,
  approved: 0,
  profileComplete: 70,
};

const mockActiveTenders = [
  { id: "TND-2026-001", title: "Supply of Office Furniture – MoE", department: "Ministry of Education", deadline: "2026-09-30", value: "₹45 Lakhs", myStatus: "Applied" },
  { id: "TND-2026-002", title: "IT Infrastructure Upgrade – DRDO", department: "DRDO", deadline: "2026-10-10", value: "₹1.2 Cr", myStatus: "Draft" },
  { id: "TND-2026-003", title: "Stationery Supply – MoF", department: "Ministry of Finance", deadline: "2026-10-15", value: "₹8 Lakhs", myStatus: null },
];

const statusColor: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-800 border-blue-200",
  Draft: "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
};

export default function BidderDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, Bidder</h2>
        <p className="text-slate-500 mt-1">Track your bids, check tender status, and manage your company profile.</p>
      </div>

      {/* Profile incomplete warning */}
      {mockStats.profileComplete < 100 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Your Company Profile is {mockStats.profileComplete}% complete</p>
            <p className="text-sm text-amber-700">Complete your profile to speed up bid applications — details are auto-filled.</p>
          </div>
          <Link href="/bidder/profile">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
              Complete Profile <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Bids</p>
                <p className="text-3xl font-bold text-slate-900">{mockStats.activeBids}</p>
              </div>
              <UploadCloud className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900">{mockStats.pendingReview}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Approved</p>
                <p className="text-3xl font-bold text-slate-900">{mockStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Profile</p>
                <p className="text-3xl font-bold text-slate-900">{mockStats.profileComplete}%</p>
              </div>
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tenders Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800">Available Tenders</CardTitle>
          <Link href="/bidder/apply">
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
              Browse All Tenders <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockActiveTenders.map((tender) => (
              <div key={tender.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{tender.id}</span>
                    {tender.myStatus && (
                      <Badge variant="outline" className={statusColor[tender.myStatus]}>
                        {tender.myStatus}
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold text-slate-800">{tender.title}</p>
                  <p className="text-sm text-slate-500">{tender.department} &bull; Deadline: {tender.deadline} &bull; <span className="font-semibold text-blue-700">{tender.value}</span></p>
                </div>
                <Link href={`/bidder/apply?tender=${tender.id}`}>
                  <Button size="sm" variant="outline" className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-50 shrink-0">
                    {tender.myStatus === "Applied" ? "View Application" : "Start Application"} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
