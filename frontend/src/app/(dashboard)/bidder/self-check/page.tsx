"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileType, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SelfCheckTool() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          startAnalysis();
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  const resetTool = () => {
    setShowResults(false);
    setProgress(0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Pre-Bid Self-Check Simulator</h2>
        <p className="text-slate-500">Upload your documents to run an instant AI compliance audit before official submission.</p>
      </div>

      {!showResults && !isUploading && !isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>Drag and drop your statutory documents here. Supported formats: PDF, JPG, PNG.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={handleSimulateUpload}
            >
              <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Click to browse or drag documents here</h3>
              <p className="text-sm text-slate-500 mb-4">Upload PAN, GST Certificate, Udyam Registration, and Financials</p>
              <Button type="button" variant="outline">Select Files</Button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Required Documents</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-slate-600 bg-slate-50 p-2 rounded"><FileType className="h-4 w-4 mr-2" /> GST Registration (GSTR-3B)</div>
                <div className="flex items-center text-slate-600 bg-slate-50 p-2 rounded"><FileType className="h-4 w-4 mr-2" /> Udyam MSME Certificate</div>
                <div className="flex items-center text-slate-600 bg-slate-50 p-2 rounded"><FileType className="h-4 w-4 mr-2" /> Permanent Account Number (PAN)</div>
                <div className="flex items-center text-slate-600 bg-slate-50 p-2 rounded"><FileType className="h-4 w-4 mr-2" /> CA Certified Turnover (Last 3 Years)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(isUploading || isAnalyzing) && (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            {isUploading ? (
              <UploadCloud className="h-16 w-16 text-teal-500 animate-pulse" />
            ) : (
              <RefreshCw className="h-16 w-16 text-teal-500 animate-spin" />
            )}
            
            <div className="space-y-2 w-full max-w-md">
              <h3 className="text-xl font-semibold">
                {isUploading ? 'Uploading Documents...' : 'AI Forensic Analysis in Progress...'}
              </h3>
              <p className="text-slate-500 text-sm">
                {isUploading 
                  ? 'Securely transferring files to the verification engine.'
                  : 'Running OCR extraction, verifying digital signatures, and checking API endpoints.'}
              </p>
              {isUploading && (
                <div className="pt-4">
                  <Progress value={progress} className="h-2 w-full bg-slate-100" />
                  <p className="text-xs text-right mt-1 text-slate-400">{progress}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-t-4 border-t-amber-500">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <ShieldCheck className="mr-2 h-6 w-6 text-amber-500" />
                    Self-Check Results
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Your documents have been analyzed. Please fix the warnings before submitting your official bid.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-500">75%</div>
                  <div className="text-sm font-medium text-slate-500 uppercase">Compliance Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h3 className="font-semibold text-lg mb-3 border-b pb-2">Document Verification</h3>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 border rounded-md bg-white shadow-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-teal-500 mr-3" />
                      <div>
                        <p className="font-medium">GST Certificate</p>
                        <p className="text-xs text-slate-500">Verified via GSTN API • Active Status</p>
                      </div>
                    </div>
                    <Badge className="bg-teal-100 text-teal-800">Pass</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-amber-200 rounded-md bg-amber-50 shadow-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                      <div>
                        <p className="font-medium text-amber-900">Udyam Registration</p>
                        <p className="text-xs text-amber-700">Warning: Registration expires in 15 days.</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-red-200 rounded-md bg-red-50 shadow-sm">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium text-red-900">Financial Turnover Document</p>
                        <p className="text-xs text-red-700">Error: Document resolution too low (OCR failed). Please re-scan.</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Fail</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm uppercase">AI Recommendations</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-slate-400">1.</span>
                    Re-upload the CA Certified Turnover document with a minimum resolution of 300 DPI.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-slate-400">2.</span>
                    Initiate renewal of Udyam MSME certificate to prevent rejection during the evaluation phase.
                  </li>
                </ul>
              </div>

            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between rounded-b-lg border-t">
              <Button variant="outline" onClick={resetTool}>Start Over</Button>
              <Button className="bg-slate-800 hover:bg-slate-900" disabled>Proceed to Submit (Fix Errors First)</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
