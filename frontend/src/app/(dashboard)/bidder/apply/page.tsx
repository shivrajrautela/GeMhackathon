"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Calendar, IndianRupee, Building } from "lucide-react";

// Mock tender list — will be replaced with real API data later
const availableTenders = [
  {
    id: "TND-2026-001",
    title: "Supply of Office Furniture",
    department: "Ministry of Education",
    description: "Procurement of ergonomic chairs, desks, and storage units for 3 regional offices.",
    deadline: "30 Sep 2026",
    value: "₹45 Lakhs",
    category: "Goods",
    status: "Open",
  },
  {
    id: "TND-2026-002",
    title: "IT Infrastructure Upgrade – DRDO",
    department: "DRDO",
    description: "Supply and installation of servers, networking equipment, and UPS systems.",
    deadline: "10 Oct 2026",
    value: "₹1.2 Crore",
    category: "IT",
    status: "Open",
  },
  {
    id: "TND-2026-003",
    title: "Stationery & Printing Materials",
    department: "Ministry of Finance",
    description: "Annual supply contract for office stationery, printing paper, and binding materials.",
    deadline: "15 Oct 2026",
    value: "₹8 Lakhs",
    category: "Goods",
    status: "Open",
  },
  {
    id: "TND-2026-004",
    title: "Housekeeping Services",
    department: "Ministry of Railways",
    description: "Outsourced housekeeping and sanitation services for 5 railway divisions.",
    deadline: "20 Oct 2026",
    value: "₹32 Lakhs",
    category: "Services",
    status: "Open",
  },
  {
    id: "TND-2026-005",
    title: "Solar Panel Installation",
    department: "Ministry of New & Renewable Energy",
    description: "Design, supply, and installation of 100kW rooftop solar systems across 4 buildings.",
    deadline: "5 Nov 2026",
    value: "₹2.8 Crore",
    category: "Works",
    status: "Open",
  },
];

const categoryColor: Record<string, string> = {
  Goods: "bg-blue-100 text-blue-800 border-blue-200",
  IT: "bg-purple-100 text-purple-800 border-purple-200",
  Services: "bg-green-100 text-green-800 border-green-200",
  Works: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function SubmitBidPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Submit a Bid</h2>
        <p className="text-slate-500 mt-1">Browse open tenders below and start your application. Your company profile details will be auto-filled.</p>
      </div>

      <div className="grid gap-4">
        {availableTenders.map((tender) => (
          <Card key={tender.id} className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{tender.id}</span>
                    <Badge variant="outline" className={categoryColor[tender.category]}>
                      {tender.category}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {tender.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{tender.title}</h3>
                  <p className="text-sm text-slate-600">{tender.description}</p>
                  <div className="flex items-center gap-5 text-sm text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" /> {tender.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Deadline: <span className="font-semibold text-slate-700">{tender.deadline}</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-bold">
                      <IndianRupee className="h-4 w-4" /> {tender.value}
                    </span>
                  </div>
                </div>
                <Link href={`/bidder/apply/${tender.id}`} className="shrink-0">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white whitespace-nowrap">
                    Start Application <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
