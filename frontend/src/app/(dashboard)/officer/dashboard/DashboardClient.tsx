"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, ShieldCheck } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

type DashboardClientProps = {
  activeTenders: any[];
  pendingBids: any[];
  highRiskBids: any[];
  allBidders: any[];
  tenderData: any[];
};

export default function DashboardClient({
  activeTenders,
  pendingBids,
  highRiskBids,
  allBidders,
  tenderData
}: DashboardClientProps) {
  
  const riskData = [
    { name: 'Low Risk', value: allBidders.filter(b => b.riskTag === 'Low').length, color: '#10b981' }, 
    { name: 'Medium Risk', value: allBidders.filter(b => b.riskTag === 'Medium').length, color: '#fbbf24' }, // amber-400
    { name: 'High Risk', value: highRiskBids.length, color: '#ef4444' }, 
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Procurement Overview</h2>
        <p className="text-slate-500 mt-2 text-sm">Monitor active tenders and bid compliance across all departments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-none border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-cyan-400 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Tenders</CardTitle>
            <FileText className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeTenders.length}</div>
            <p className="text-xs text-cyan-700 font-medium mt-1 bg-cyan-50 inline-block px-2 py-0.5">+2 this month</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-amber-400 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Reviews</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingBids.length}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Across all active tenders</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-rose-400 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">High Risk Bids</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{highRiskBids.length}</div>
            <p className="text-xs text-rose-700 font-medium mt-1 bg-rose-50 inline-block px-2 py-0.5">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-emerald-400 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {Math.round((allBidders.filter(b => b.riskTag === 'Low').length / (allBidders.length || 1)) * 100)}%
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1 bg-emerald-50 inline-block px-2 py-0.5">Average compliance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-8 border-b border-slate-100 mb-6">
            <CardTitle className="text-lg text-slate-900 font-bold uppercase tracking-wide">Bids per Tender</CardTitle>
            <CardDescription className="text-slate-500 text-xs">Volume of applications received per active tender.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenderData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '0px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="bids" fill="#06b6d4" radius={[0, 0, 0, 0]} animationDuration={1500} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-none border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-8 border-b border-slate-100 mb-6">
            <CardTitle className="text-lg text-slate-900 font-bold uppercase tracking-wide">Risk Distribution</CardTitle>
            <CardDescription className="text-slate-500 text-xs">AI-assessed risk levels across all submitted bids.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="45%"
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="square" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
