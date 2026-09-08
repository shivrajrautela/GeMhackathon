import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function OfficerBiddersPage() {
  let allBidders = [];

  try {
    const bidsRes = await fetch('http://localhost:5000/api/bids', { cache: 'no-store' });
    const bidsJson = await bidsRes.json();
    if (bidsJson.success) {
      allBidders = bidsJson.data.map((b: any) => ({
        id: b.id.substring(0, 8),
        companyName: b.profiles?.company_name || 'Unknown',
        financialTurnover: '₹' + (Math.floor(Math.random() * 5) + 1) + ' Cr', // mock since our DB doesn't have it yet
        complianceScore: b.risk_score === null ? 0 : 100 - b.risk_score,
        riskTag: b.risk_score === null ? 'Pending' : (b.risk_score < 30 ? 'Low' : (b.risk_score < 60 ? 'Medium' : 'High')),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch from backend", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bidder Database</h2>
        <p className="text-slate-600 mt-1">Directory of all registered MSMEs and bidders across the portal.</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Registered Bidders</CardTitle>
              <CardDescription>View compliance status and profiles of participating entities.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="Search company name..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Financial Turnover</TableHead>
                <TableHead>Average Compliance</TableHead>
                <TableHead>Risk Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBidders.map((bidder: any) => (
                <TableRow key={bidder.id}>
                  <TableCell className="font-medium">{bidder.id}</TableCell>
                  <TableCell>{bidder.companyName}</TableCell>
                  <TableCell>{bidder.financialTurnover}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{bidder.complianceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      bidder.riskTag === 'Low' ? 'text-green-700 bg-green-50 border-green-200' : 
                      bidder.riskTag === 'Medium' ? 'text-orange-700 bg-orange-50 border-orange-200' : 
                      'text-red-700 bg-red-50 border-red-200'
                    }>
                      {bidder.riskTag} Risk
                    </Badge>
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
