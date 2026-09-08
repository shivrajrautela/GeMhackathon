"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { mockTenders } from "@/lib/mock-data";
import { Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function OfficerTenders() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Active Tenders</h2>
        <p className="text-slate-500">Manage and evaluate bids for your department's active procurements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tender List</CardTitle>
          <CardDescription>Click on a tender to view all submitted bids and AI compliance scores.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Bids</TableHead>
                <TableHead>Avg. Risk</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenders.map((tender) => (
                <TableRow key={tender.id}>
                  <TableCell className="font-medium">{tender.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{tender.title}</span>
                      <span className="text-xs text-slate-500">{tender.department}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tender.deadline}</TableCell>
                  <TableCell>
                    <Badge variant={tender.status === 'Active' ? 'default' : 'secondary'}
                           className={tender.status === 'Active' ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' : ''}>
                      {tender.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tender.bidsCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      tender.avgRiskScore < 30 ? 'text-teal-600 border-teal-200' : 
                      tender.avgRiskScore < 50 ? 'text-amber-600 border-amber-200' : 'text-red-600 border-red-200'
                    }>
                      {tender.avgRiskScore}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/officer/tenders/${tender.id}`} 
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View Bids
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
