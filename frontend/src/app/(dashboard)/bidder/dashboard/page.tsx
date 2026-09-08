"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UploadCloud, FileCheck, AlertTriangle, CheckCircle, Clock, ArrowRight, Building2, Loader2, IndianRupee } from "lucide-react";

export default function BidderDashboard() {
  const [userName, setUserName] = useState("Bidder");
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    activeBids: 0,
    pendingReview: 0,
    approved: 0,
    profileComplete: 0,
  });
  
  const [recentTenders, setRecentTenders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Fetch Profile
        const profileRes = await fetch(`http://localhost:5000/api/profile/${user.id}`);
        const profileJson = await profileRes.json();
        let profileCompletion = 0;
        
        if (profileJson.success && profileJson.data) {
          const p = profileJson.data;
          // Set name to Company Name or Owner Name if available
          if (p.companyName) setUserName(p.companyName);
          else if (p.ownerName) setUserName(p.ownerName);
          else if (user.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
          
          // Calculate profile completion %
          const fields = [p.companyName, p.ownerName, p.email, p.phone, p.address, p.city, p.state, p.gstin, p.pan, p.turnover];
          const filled = fields.filter(val => val && val.trim() !== "").length;
          profileCompletion = Math.round((filled / fields.length) * 100);
        } else {
           if (user.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
        }

        // 2. Fetch User's Bids
        const bidsRes = await fetch(`http://localhost:5000/api/bids/${user.id}`);
        const bidsJson = await bidsRes.json();
        let bidsList: any[] = [];
        
        if (bidsJson.success) {
          bidsList = bidsJson.data;
        }

        const activeBids = bidsList.length;
        const pendingReview = bidsList.filter(b => b.status === "Under Review").length;
        const approved = bidsList.filter(b => b.status === "Approved").length;

        setStats({
          activeBids,
          pendingReview,
          approved,
          profileComplete: profileCompletion
        });

        // 3. Fetch Tenders to show recent open ones
        const tendersRes = await fetch(`http://localhost:5000/api/tenders`);
        const tendersJson = await tendersRes.json();
        
        if (tendersJson.success) {
          const openTenders = tendersJson.data.filter((t: any) => t.status !== "Closed").slice(0, 4);
          
          // Map user status to tenders
          const mappedTenders = openTenders.map((t: any) => {
            const hasApplied = bidsList.some(b => b.tender_id === t.id);
            return {
              ...t,
              myStatus: hasApplied ? "Applied" : null
            };
          });
          setRecentTenders(mappedTenders);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, {userName}</h2>
        <p className="text-slate-500 mt-1">Track your bids, check tender status, and manage your company profile.</p>
      </div>

      {/* Profile incomplete warning */}
      {stats.profileComplete < 100 && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Your Company Profile is {stats.profileComplete}% complete</p>
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
                <p className="text-sm text-slate-500 font-medium">Total Bids</p>
                <p className="text-3xl font-bold text-slate-900">{stats.activeBids}</p>
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
                <p className="text-3xl font-bold text-slate-900">{stats.pendingReview}</p>
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
                <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
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
                <p className="text-3xl font-bold text-slate-900">{stats.profileComplete}%</p>
              </div>
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Suggested / Active Tenders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Latest Open Tenders</h3>
          <Link href="/bidder/apply" className="text-sm text-blue-600 font-semibold hover:underline">
            View All Tenders
          </Link>
        </div>
        
        <div className="grid gap-3">
          {recentTenders.map((t) => (
            <Card key={t.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-slate-400">{t.id}</span>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                      {t.department}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">{t.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span>Deadline: <strong className="text-slate-700">{t.deadline}</strong></span>
                    <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {t.budget}</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  {t.myStatus === "Applied" ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                      Applied
                    </Badge>
                  ) : (
                    <Link href={`/bidder/apply/${t.id}`}>
                      <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                        Apply Now
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {recentTenders.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
              No recent tenders available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
