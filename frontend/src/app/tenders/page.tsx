"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, Search, Filter, Calendar, IndianRupee, Users,
  CheckCircle, Clock, FileText, ChevronDown, Landmark, User,
  Lock, ArrowRight, ShieldCheck, ArrowLeft, Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Tender {
  id: string;
  title: string;
  department: string;
  budget: string;
  deadline: string;
  description: string;
  bidsCount?: number;
  status: string;
}

export default function PublicTendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchPublicTenders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tenders`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTenders(json.data);
        } else if (Array.isArray(json)) {
          setTenders(json);
        }
      } catch (err) {
        console.error("Failed to load tenders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTenders();
  }, []);

  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500/30">
      {/* Navigation - Public Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/logo.svg"
              alt="GeM Verify Logo"
              className="h-12 w-auto object-contain drop-shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                GeM <span className="text-blue-600">Verify</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Govt. Procurement Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/#features"
              className="hidden md:flex text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide items-center"
            >
              Features
            </Link>

            <Link
              href="/#about"
              className="hidden md:flex text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide items-center"
            >
              About
            </Link>

            <Link
              href="/tenders"
              className="text-base font-bold text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide flex items-center"
            >
              <Activity className="h-4 w-4 mr-1.5 text-blue-500 animate-pulse" />
              Live Tenders
            </Link>

            {/* Register Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide flex items-center focus:outline-none cursor-pointer">
                Register <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg rounded-md z-50">
                <DropdownMenuItem onClick={() => router.push("/auth/register")} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full group">
                  <User className="mr-3 h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700">Register as Contractor (Bidder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/auth/register")} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full group">
                  <Landmark className="mr-3 h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700">Register as Procurement Officer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-blue-700 hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-lg text-white font-bold text-base px-7 py-2.5 rounded transition-all duration-300 flex items-center shadow-md focus:outline-none cursor-pointer">
                Login <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg rounded-md z-50">
                <DropdownMenuItem onClick={() => router.push("/auth/login")} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <User className="mr-3 h-5 w-5 text-orange-500" />
                  <span className="font-medium text-slate-700">Login as Contractor (Bidder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/auth/login")} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <Landmark className="mr-3 h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Login as Procurement Officer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Banner for Public Notice Board */}
      <div className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-4 group">
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Public Procurement Notice Board
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Live Government Tenders
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl font-medium">
                Official notices published under Government e-Marketplace procurement guidelines. Verified contractors and MSMEs can review active opportunities and submit proposals.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
              <div className="text-center px-4 border-r border-slate-200">
                <div className="text-2xl font-black text-blue-600">{tenders.length}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tenders</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-black text-green-600">
                  {tenders.filter((t) => t.status === "Active").length}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Bidding</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Tender ID, Title, or Department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {["All", "Active", "Under Review", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tender Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
            <span className="text-slate-500 font-medium text-sm">Loading verified tenders...</span>
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching tenders found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search query or filter criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTenders.map((tender) => (
              <div
                key={tender.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded">
                        {tender.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Landmark className="h-3.5 w-3.5 text-slate-400" />
                        {tender.department}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          tender.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : tender.status === "Under Review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }
                      >
                        {tender.status === "Active" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {tender.status === "Under Review" && <Clock className="h-3 w-3 mr-1" />}
                        {tender.status}
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {tender.title}
                    </h2>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                      {tender.description}
                    </p>

                    <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-600 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                        <span>Budget: <strong className="text-slate-800">{tender.budget}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>Deadline: <strong className="text-slate-800">{tender.deadline}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>Total Bids: <strong className="text-slate-800">{tender.bidsCount ?? 0} Submissions</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 justify-center">
                    {tender.status === "Active" ? (
                      <Link
                        href={`/bidder/apply/${tender.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group-hover:scale-102"
                      >
                        Apply / Submit Bid <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-slate-100 text-slate-400 font-bold text-sm px-6 py-3 rounded-lg cursor-not-allowed text-center"
                      >
                        Bidding Closed
                      </button>
                    )}
                    <Link
                      href="/auth/login"
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-xs px-4 py-2 rounded-lg text-center transition-colors"
                    >
                      Officer Portal Login
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security & Access Disclaimer */}
        <div className="mt-12 p-6 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-900">Procurement Officer Privacy & Security Notice</h4>
            <p className="text-xs font-medium text-blue-800 leading-relaxed">
              Proprietary financial bids, bidder GSTN/PAN verification logs, and AI-powered document tampering analyses are restricted strictly to authorized government procurement officers. Public users can browse active tender notices and submit authenticated proposals.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-center text-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Gem-Verify Logo" className="h-8 w-auto object-contain drop-shadow-md" />
            <span className="text-xl font-bold tracking-tight text-white">GeM Verify</span>
          </div>
          <p className="font-medium text-slate-400">
            © 2026 Internal Hackathon Prototype. Developed for the Government of India e-Marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
}
