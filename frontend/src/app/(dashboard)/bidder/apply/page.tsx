"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Calendar, IndianRupee, Building, Loader2 } from "lucide-react";

export default function SubmitBidPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tenders");
        const json = await res.json();
        if (json.success) {
          // Filter to only show Active or Under Review tenders
          const activeTenders = json.data.filter((t: any) => t.status !== 'Closed');
          setTenders(activeTenders);
        }
      } catch (err) {
        console.error("Failed to fetch tenders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading open tenders from Government portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Submit a Bid</h2>
        <p className="text-slate-500 mt-1">Browse {tenders.length} open tenders below and start your application. Your company profile details will be auto-filled.</p>
      </div>

      <div className="grid gap-4">
        {tenders.map((tender) => (
          <Card key={tender.id} className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{tender.id}</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Gov Procurement
                    </Badge>
                    <Badge variant="outline" className={tender.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                      {tender.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{tender.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{tender.description}</p>
                  <div className="flex items-center gap-5 text-sm text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" /> {tender.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Deadline: <span className="font-semibold text-slate-700">{tender.deadline}</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-bold">
                      <IndianRupee className="h-4 w-4" /> {tender.budget}
                    </span>
                  </div>
                </div>
                <Link href={`/bidder/apply/${tender.id}`} className="shrink-0 mt-2">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white whitespace-nowrap">
                    Start Application <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {tenders.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No open tenders available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
