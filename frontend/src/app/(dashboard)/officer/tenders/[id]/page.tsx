"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBidders, getTenderById, Bidder } from "@/lib/mock-data";
import { 
  FileSearch, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  ShieldAlert,
  FileCheck2,
  Maximize2,
  ShieldCheck
} from "lucide-react";

export default function TenderBids() {
  const params = useParams();
  const tenderId = params.id as string;
  const tender = getTenderById(tenderId);
  
  const bidders = mockBidders.filter(b => b.tenderId === tenderId);
  const [selectedBidder, setSelectedBidder] = useState<Bidder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openBidderEvaluation = (bidder: Bidder) => {
    setSelectedBidder(bidder);
    setIsSheetOpen(true);
  };

  if (!tender) return <div>Tender not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">{tender.title}</h2>
        <p className="text-slate-500">Tender ID: {tender.id} • Deadline: {tender.deadline}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Bids</CardTitle>
          <CardDescription>AI-verified compliance overview for all applicants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Risk Tag</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bidders.map((bidder) => (
                <TableRow key={bidder.id}>
                  <TableCell className="font-medium">{bidder.id}</TableCell>
                  <TableCell>{bidder.companyName}</TableCell>
                  <TableCell>{bidder.submissionDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 max-w-[100px]">
                        <div 
                          className={`h-2.5 rounded-full ${
                            bidder.complianceScore >= 80 ? 'bg-teal-500' :
                            bidder.complianceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${bidder.complianceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{bidder.complianceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      bidder.riskTag === 'Low' ? 'text-teal-700 bg-teal-50 border-teal-200' : 
                      bidder.riskTag === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                      'text-red-700 bg-red-50 border-red-200'
                    }>
                      {bidder.riskTag} Risk
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openBidderEvaluation(bidder)}>
                      Evaluate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bidders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                    No bids found for this tender.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bid Evaluation Interface via Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-5xl overflow-y-auto">
          {selectedBidder && (
            <div className="h-full flex flex-col space-y-6">
              <SheetHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl">{selectedBidder.companyName}</SheetTitle>
                    <SheetDescription>Bid ID: {selectedBidder.id} • Submitted: {selectedBidder.submissionDate}</SheetDescription>
                  </div>
                  <Badge variant="outline" className={`text-lg px-3 py-1 ${
                    selectedBidder.riskTag === 'Low' ? 'text-teal-700 bg-teal-50 border-teal-200' : 
                    selectedBidder.riskTag === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                    'text-red-700 bg-red-50 border-red-200'
                  }`}>
                    {selectedBidder.riskTag} Risk ({selectedBidder.complianceScore}% Compliance)
                  </Badge>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Risk Assessment</TabsTrigger>
                  <TabsTrigger value="documents">Document Verification</TabsTrigger>
                  <TabsTrigger value="audit">System Audit Log</TabsTrigger>
                </TabsList>

                {/* Risk Assessment Tab */}
                <TabsContent value="overview" className="space-y-4 flex-1 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-teal-500" />
                          Matched Criteria
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedBidder.matchedCriteria.map((c, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-700">
                              <span className="mr-2 text-teal-500">•</span> {c}
                            </li>
                          ))}
                          {selectedBidder.matchedCriteria.length === 0 && (
                            <li className="text-sm text-slate-500 italic">No matched criteria found.</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <ShieldAlert className="h-4 w-4 mr-2 text-red-500" />
                          Discrepancies & Flags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedBidder.discrepancies.map((c, i) => (
                            <li key={i} className="flex items-start text-sm text-red-700">
                              <span className="mr-2">•</span> {c}
                            </li>
                          ))}
                          {selectedBidder.discrepancies.length === 0 && (
                            <li className="text-sm text-slate-500 italic">No discrepancies found.</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Statutory API Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded-lg p-3 text-center flex flex-col items-center">
                          <span className="text-xs text-slate-500 mb-1 uppercase font-semibold">GSTN Status</span>
                          {selectedBidder.verification.gstn.status === 'Verified' ? (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100"><CheckCircle className="h-3 w-3 mr-1"/> Active</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1"/> {selectedBidder.verification.gstn.status}</Badge>
                          )}
                          <span className="text-xs text-slate-400 mt-2">{selectedBidder.verification.gstn.details}</span>
                        </div>
                        <div className="border rounded-lg p-3 text-center flex flex-col items-center">
                          <span className="text-xs text-slate-500 mb-1 uppercase font-semibold">Udyam Registration</span>
                          {selectedBidder.verification.udyam.status === 'Verified' ? (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100"><CheckCircle className="h-3 w-3 mr-1"/> Verified</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100"><AlertTriangle className="h-3 w-3 mr-1"/> {selectedBidder.verification.udyam.status}</Badge>
                          )}
                          <span className="text-xs text-slate-400 mt-2">{selectedBidder.verification.udyam.details}</span>
                        </div>
                        <div className="border rounded-lg p-3 text-center flex flex-col items-center">
                          <span className="text-xs text-slate-500 mb-1 uppercase font-semibold">Income Tax / PAN</span>
                          {selectedBidder.verification.pan.status === 'Verified' ? (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100"><CheckCircle className="h-3 w-3 mr-1"/> Matched</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1"/> {selectedBidder.verification.pan.status}</Badge>
                          )}
                          <span className="text-xs text-slate-400 mt-2">{selectedBidder.verification.pan.details}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Document Verification Tab (Side-by-side) */}
                <TabsContent value="documents" className="h-[400px] mt-4 flex space-x-4">
                  <div className="w-1/2 border rounded-md bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-white/80 p-1 rounded backdrop-blur">
                      <Maximize2 className="h-4 w-4 text-slate-600" />
                    </div>
                    {/* Simulated Document View */}
                    <div className="bg-white p-8 shadow-sm w-3/4 h-3/4 border flex flex-col space-y-4">
                      <div className="border-b pb-2 text-center font-bold font-serif text-lg">
                        GOVERNMENT OF INDIA<br/>CERTIFICATE OF REGISTRATION
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                          <span className="text-slate-500">Legal Name</span>
                          <span className="font-semibold font-mono">{selectedBidder.companyName}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                          <span className="text-slate-500">Financial Turnover</span>
                          <span className="font-semibold font-mono">{selectedBidder.financialTurnover}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                          <span className="text-slate-500">Registration No.</span>
                          <span className="font-semibold font-mono">REG-2022-X789</span>
                        </div>
                      </div>
                      {selectedBidder.documentFlags.tamperingDetected && (
                        <div className="absolute inset-0 border-4 border-red-500/50 flex items-center justify-center pointer-events-none">
                          <div className="bg-red-500 text-white font-bold py-2 px-6 rotate-45 opacity-70 tracking-widest text-2xl">
                            TAMPERING DETECTED
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col space-y-4">
                    <Card className="flex-1">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileSearch className="h-4 w-4 mr-2" />
                          OCR Extraction Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Extracted Name:</span>
                          <span className="text-sm font-medium">{selectedBidder.companyName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Extracted Turnover:</span>
                          <span className="text-sm font-medium">{selectedBidder.financialTurnover}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Document Type:</span>
                          <span className="text-sm font-medium">GST Certificate (GSTR-3B)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Confidence Score:</span>
                          <span className={`text-sm font-medium ${selectedBidder.documentFlags.lowResolution ? 'text-amber-600' : 'text-teal-600'}`}>
                            {selectedBidder.documentFlags.lowResolution ? '78% (Low Res)' : '98%'}
                          </span>
                        </div>
                        
                        {selectedBidder.documentFlags.tamperingDetected && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800">
                              <strong>Forensic Alert:</strong> Digital signature mismatch and metadata anomalies detected in the uploaded PDF. Pixel inconsistency found in financial digits.
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Audit Log Tab */}
                <TabsContent value="audit" className="mt-4 flex-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> System Activity Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <FileCheck2 className="h-4 w-4" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-slate-800 text-sm">Bid Received</div>
                              <time className="text-xs font-medium text-amber-500">10:00 AM</time>
                            </div>
                            <div className="text-slate-500 text-xs">System registered new bid submission documents.</div>
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <FileSearch className="h-4 w-4" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-slate-800 text-sm">OCR Extraction Complete</div>
                              <time className="text-xs font-medium text-amber-500">10:02 AM</time>
                            </div>
                            <div className="text-slate-500 text-xs">Successfully extracted metadata from 4 uploaded documents.</div>
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-slate-800 text-sm">Statutory API Verification</div>
                              <time className="text-xs font-medium text-amber-500">10:03 AM</time>
                            </div>
                            <div className="text-slate-500 text-xs">Simulated API calls to GSTN, Udyam, and IT portals completed.</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="pt-4 border-t flex justify-end space-x-3 mt-auto">
                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                <Button className="bg-amber-500 hover:bg-amber-600">Flag for Clarification</Button>
                <Button variant="destructive">Reject Bid</Button>
                <Button className="bg-teal-600 hover:bg-teal-700">Approve Bid</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
