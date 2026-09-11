"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ArrowRight, UploadCloud, FileText, CheckCircle,
  Building2, User, Phone, Mail, Hash, MapPin, Eye, Send, X, Loader2
} from "lucide-react";

// Mock tender details — in production, fetch by ID from backend
const tenderDetails: Record<string, { title: string; department: string; value: string; deadline: string }> = {
  "TND-2026-001": { title: "Supply of Office Furniture", department: "Ministry of Education", value: "₹45 Lakhs", deadline: "30 Sep 2026" },
  "TND-2026-002": { title: "IT Infrastructure Upgrade – DRDO", department: "DRDO", value: "₹1.2 Crore", deadline: "10 Oct 2026" },
  "TND-2026-003": { title: "Stationery & Printing Materials", department: "Ministry of Finance", value: "₹8 Lakhs", deadline: "15 Oct 2026" },
  "TND-2026-004": { title: "Housekeeping Services", department: "Ministry of Railways", value: "₹32 Lakhs", deadline: "20 Oct 2026" },
  "TND-2026-005": { title: "Solar Panel Installation", department: "MNRE", value: "₹2.8 Crore", deadline: "5 Nov 2026" },
};

type Step = "form" | "preview" | "submitted";

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const tenderId = params?.id as string;
  const tender = tenderDetails[tenderId] ?? { title: "Unknown Tender", department: "-", value: "-", deadline: "-" };

  const [step, setStep] = useState<Step>("form");
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved company profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gem_company_profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") setUploadedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (uploadedFile) {
      setSubmitting(true);
      // Convert file to base64 for the Gemini AI backend to process later
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        localStorage.setItem("gem_demo_pdf_base64", base64String);
        console.log("PDF saved to localStorage for AI Analysis!");

        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Send submission record to backend (including PDF base64!)
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bids`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                tender_id: tenderId,
                profile_id: user.id,
                company_name: profile.companyName,
                pdfBase64: base64String
              })
            });
          }
        } catch (err) {
          console.error("Failed to submit bid to backend:", err);
        } finally {
          setSubmitting(false);
          setStep("submitted");
        }
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setStep("submitted");
    }
  };

  // ─── STEP: SUBMITTED ────────────────────────────────────────────────
  if (step === "submitted") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
        <p className="text-slate-600 max-w-md text-lg">
          Your bid for <span className="font-semibold text-blue-700">{tender.title}</span> has been submitted. Our AI verification engine will review your documents and update you shortly.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 text-sm text-slate-600 font-mono">
          Reference: <span className="font-bold text-slate-900">{tenderId}-APP-{Date.now().toString().slice(-6)}</span>
        </div>
        <Link href="/bidder/dashboard">
          <Button className="bg-blue-700 hover:bg-blue-800">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // ─── STEP: PREVIEW ───────────────────────────────────────────────────
  if (step === "preview") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/bidder/apply" className="hover:text-blue-600">Submit Bid</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{tender.title}</span>
          <span>/</span>
          <span className="text-blue-700 font-semibold">Preview & Submit</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">Preview Your Application</h2>
          <p className="text-slate-500 mt-1">Please verify all details before submitting your bid.</p>
        </div>

        {/* Tender Info */}
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="pb-2 bg-slate-50 border-b">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Tender Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Tender ID</span><p className="font-mono font-semibold">{tenderId}</p></div>
            <div><span className="text-slate-500">Department</span><p className="font-semibold">{tender.department}</p></div>
            <div><span className="text-slate-500">Title</span><p className="font-semibold">{tender.title}</p></div>
            <div><span className="text-slate-500">Value</span><p className="font-bold text-blue-700">{tender.value}</p></div>
            <div><span className="text-slate-500">Deadline</span><p className="font-semibold">{tender.deadline}</p></div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2 bg-slate-50 border-b">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Company Name</span><p className="font-semibold">{profile.companyName || "—"}</p></div>
            <div><span className="text-slate-500">Owner Name</span><p className="font-semibold">{profile.ownerName || "—"}</p></div>
            <div><span className="text-slate-500">Email</span><p className="font-semibold">{profile.email || "—"}</p></div>
            <div><span className="text-slate-500">Mobile</span><p className="font-semibold">{profile.phone || "—"}</p></div>
            <div><span className="text-slate-500">GSTIN</span><p className="font-mono font-semibold">{profile.gstin || "—"}</p></div>
            <div><span className="text-slate-500">PAN</span><p className="font-mono font-semibold">{profile.pan || "—"}</p></div>
            <div><span className="text-slate-500">Udyam No.</span><p className="font-mono font-semibold">{profile.udyam || "—"}</p></div>
            <div><span className="text-slate-500">Category</span><p className="font-semibold">{profile.category || "—"}</p></div>
          </CardContent>
        </Card>

        {/* Uploaded Document */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2 bg-slate-50 border-b">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Uploaded Document</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {uploadedFile ? (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">{uploadedFile.name}</span>
                <span className="text-slate-500 text-xs ml-auto">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <p className="text-amber-600 font-medium text-sm">⚠ No document uploaded. Please go back and upload your bid PDF.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setStep("form")} className="border-slate-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Edit Application
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-800 px-8"
            onClick={handleSubmit}
            disabled={!uploadedFile || submitting}
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Confirm & Submit</>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ─── STEP: FORM ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/bidder/apply" className="hover:text-blue-600">Submit Bid</Link>
        <span>/</span>
        <span className="text-blue-700 font-semibold">{tender.title}</span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">1</div>
          <span className="text-sm font-semibold text-blue-700">Application Form</span>
        </div>
        <div className="flex-1 h-px bg-slate-300 mx-2" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">2</div>
          <span className="text-sm text-slate-400">Preview</span>
        </div>
        <div className="flex-1 h-px bg-slate-300 mx-2" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">3</div>
          <span className="text-sm text-slate-400">Submit</span>
        </div>
      </div>

      {/* Tender Banner */}
      <Card className="border-l-4 border-l-blue-600 bg-blue-50 shadow-sm">
        <CardContent className="pt-4 pb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-slate-400">{tenderId}</p>
            <p className="font-bold text-slate-900 text-lg">{tender.title}</p>
            <p className="text-sm text-slate-500">{tender.department} &bull; <span className="font-semibold text-blue-700">{tender.value}</span> &bull; Deadline: {tender.deadline}</p>
          </div>
        </CardContent>
      </Card>

      {/* Auto-filled Company Details */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-800">Company Details</CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Auto-filled from Profile</Badge>
          </div>
          <CardDescription>These details are pulled from your Company Profile. <Link href="/bidder/profile" className="text-blue-600 hover:underline font-medium">Edit Profile</Link></CardDescription>
        </CardHeader>
        <CardContent className="pt-5 grid grid-cols-2 gap-4 text-sm">
          {[
            { icon: Building2, label: "Company Name", val: profile.companyName },
            { icon: User, label: "Owner Name", val: profile.ownerName },
            { icon: Mail, label: "Email", val: profile.email },
            { icon: Phone, label: "Mobile", val: profile.phone },
            { icon: Hash, label: "GSTIN", val: profile.gstin },
            { icon: Hash, label: "PAN", val: profile.pan },
            { icon: Hash, label: "Udyam No.", val: profile.udyam },
            { icon: MapPin, label: "Address", val: profile.city ? `${profile.address}, ${profile.city}` : "" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="space-y-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{val || <span className="text-slate-400 italic">Not filled</span>}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PDF Upload */}
      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold text-slate-800">Upload Bid Document (PDF)</CardTitle>
          </div>
          <CardDescription>Upload your complete bid document. Max size: 25 MB. Only PDF accepted.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"}`}
          >
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileSelect} />
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-blue-600" />
                <p className="font-semibold text-slate-800">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1"
                >
                  <X className="h-3 w-3" /> Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <UploadCloud className="h-10 w-10 text-slate-400" />
                <p className="font-semibold text-slate-600">Drag & drop your PDF here</p>
                <p className="text-sm text-slate-400">or click to browse files</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href="/bidder/apply">
          <Button variant="outline" className="border-slate-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenders
          </Button>
        </Link>
        <Button
          className="bg-blue-700 hover:bg-blue-800 px-8"
          onClick={() => setStep("preview")}
          disabled={!uploadedFile}
        >
          Save & Preview <Eye className="ml-2 h-4 w-4" />
        </Button>
        {!uploadedFile && (
          <p className="text-xs text-amber-600 font-medium">Please upload your bid PDF to continue.</p>
        )}
      </div>
    </div>
  );
}
