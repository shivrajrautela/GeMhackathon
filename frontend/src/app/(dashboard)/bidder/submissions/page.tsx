"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockBidders, getTenderById } from "@/lib/mock-data";
import { FileCheck } from "lucide-react";

export default function MySubmissionsPage() {
  // For the prototype, we pretend the logged in user is BID-101
  const myBids = mockBidders.filter(b => b.id === 'BID-101');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">My Submissions</h2>
        <p className="text-slate-500">Track the real-time status and AI verification progress of your applied bids.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-teal-600" />
            Active Applications
          </CardTitle>
          <CardDescription>All bids submitted by your company.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender ID</TableHead>
                <TableHead>Tender Title</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>AI Pre-Check Score</TableHead>
                <TableHead>Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBids.map((bid) => {
                const tender = getTenderById(bid.tenderId);
                return (
                  <TableRow key={bid.id}>
                    <TableCell className="font-medium text-slate-700">{bid.tenderId}</TableCell>
                    <TableCell>{tender?.title || 'Unknown Tender'}</TableCell>
                    <TableCell>{bid.submissionDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[80px]">
                          <div 
                            className={`h-2 rounded-full ${
                              bid.complianceScore >= 80 ? 'bg-teal-500' :
                              bid.complianceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${bid.complianceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{bid.complianceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        bid.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        bid.status === 'Approved' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                        'bg-red-50 text-red-700 border-red-200'
                      }>
                        {bid.status === 'Pending' ? 'Under Evaluation' : bid.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {myBids.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    You have not submitted any bids yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
