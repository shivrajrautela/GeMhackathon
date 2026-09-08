import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle, AlertTriangle, Clock, Activity, Users, Building, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DashboardPreview() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">See every bidder's verification status at a glance.</h2>
        <a href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Explore Dashboard
        </a>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="rounded-xl border bg-white shadow-2xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
            <div className="font-semibold text-lg">Tender ID: GEM/2026/B/4523981</div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1"><Users className="h-4 w-4"/> Total Bidders: 124</span>
              <span className="flex items-center gap-1 text-green-400"><CheckCircle className="h-4 w-4"/> Verified: 82</span>
              <span className="flex items-center gap-1 text-amber-400"><Clock className="h-4 w-4"/> Pending: 31</span>
              <span className="flex items-center gap-1 text-red-400"><AlertTriangle className="h-4 w-4"/> High Risk: 11</span>
            </div>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                <tr>
                  <th className="px-6 py-4">Bidder Name</th>
                  <th className="px-6 py-4">Document Status</th>
                  <th className="px-6 py-4">Compliance Score</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Tech Solutions India", doc: "Verified", comp: "98/100", risk: "Low", riskColor: "text-green-600 bg-green-50" },
                  { name: "Global Systems Pvt Ltd", doc: "Mismatch Detected", comp: "75/100", risk: "High", riskColor: "text-red-600 bg-red-50" },
                  { name: "Apex Enterprises", doc: "Processing...", comp: "--/100", risk: "Pending", riskColor: "text-slate-600 bg-slate-100" },
                  { name: "DataCorp Analytics", doc: "Verified", comp: "92/100", risk: "Low", riskColor: "text-green-600 bg-green-50" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5", 
                        row.doc.includes("Verified") ? "text-green-600" : 
                        row.doc.includes("Mismatch") ? "text-red-600" : "text-amber-600"
                      )}>
                        {row.doc.includes("Verified") ? <CheckCircle className="h-4 w-4"/> : 
                         row.doc.includes("Mismatch") ? <AlertTriangle className="h-4 w-4"/> : <Clock className="h-4 w-4"/>}
                        {row.doc}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{row.comp}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded font-semibold text-xs", row.riskColor)}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:underline font-medium">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AiVerification() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">AI that helps officers find what matters.</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Every important AI finding is backed by supporting evidence. GeM Verify analyzes documents instantly, extracting data and flagging inconsistencies before you even open the file.
            </p>
            <a href="#how-it-works" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100">
              Learn About Verification
            </a>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-xl p-6 bg-slate-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-green-200">
                AI Confidence: 98.4%
              </div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                GST Certificate
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle className="h-4 w-4" /> OCR Complete
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle className="h-4 w-4" /> Authenticity Check Passed
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle className="h-4 w-4" /> Government Match Confirmed
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <CheckCircle className="h-4 w-4" /> No Tampering Detected
                </div>
              </div>
            </div>

            <div className="border border-red-200 rounded-xl p-6 bg-red-50 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900">Address mismatch detected</h3>
                  <div className="text-sm text-red-700 mt-2 font-medium">Evidence:</div>
                  <p className="text-sm text-red-800 mt-1 italic">"Registered address differs from the address found in the submitted document."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComplianceRisk() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Turn complex verification into clear decisions.</h2>
          <p className="text-slate-400 text-lg">Evidence-based recommendations, not black-box automation.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Compliance Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
            <div className="text-sm font-semibold tracking-widest text-slate-400 mb-2 uppercase">Compliance</div>
            <div className="text-5xl font-extrabold text-white mb-8">92 <span className="text-2xl text-slate-500 font-normal">/ 100</span></div>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Eligibility</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Registration</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Documentation</span></div>
              <div className="flex items-center gap-3 text-amber-400"><AlertTriangle className="h-5 w-5"/> <span>Technical Requirements</span></div>
            </div>
          </div>

          {/* Risk Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-8 right-8 bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider border border-green-500/20">
              Low Risk
            </div>
            <div className="text-sm font-semibold tracking-widest text-slate-400 mb-2 uppercase">Risk</div>
            <div className="text-5xl font-extrabold text-white mb-8">18 <span className="text-2xl text-slate-500 font-normal">/ 100</span></div>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Identity</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Registration</span></div>
              <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400"/> <span>Document Integrity</span></div>
              <div className="flex items-center gap-3 text-amber-400"><AlertTriangle className="h-5 w-5"/> <span>Address Inconsistency</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Transparency() {
  const timeline = [
    { time: "09:42", text: "Document uploaded" },
    { time: "09:43", text: "OCR completed" },
    { time: "09:44", text: "GST verification completed" },
    { time: "09:45", text: "AI analysis completed" },
    { time: "09:46", text: "Risk score generated" },
    { time: "09:48", text: "Officer review completed", highlight: true },
  ];

  return (
    <section className="py-24 bg-white border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1 relative">
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-100"></div>
            <div className="space-y-6 relative z-10">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className={cn("w-16 text-right text-sm font-medium", item.highlight ? "text-primary" : "text-slate-400")}>
                    {item.time}
                  </div>
                  <div className={cn("h-3 w-3 rounded-full border-2 bg-white", item.highlight ? "border-primary" : "border-slate-300")}></div>
                  <div className={cn("text-base font-medium", item.highlight ? "text-slate-900" : "text-slate-600")}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">Every verification action leaves a trace.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              GeM Verify provides traceability across the verification workflow through a comprehensive audit trail. Secure, immutable logging ensures complete transparency and accountability for every procurement decision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Impact() {
  return (
    <section className="py-24 bg-slate-50 border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-3">50–120</div>
            <div className="text-slate-600 font-medium">Bids per tender</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-3">500–1,200</div>
            <div className="text-slate-600 font-medium">Documents per tender</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-green-600 mb-3">60–80%</div>
            <div className="text-slate-600 font-medium">Target reduction in manual document-checking effort</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-green-600 mb-3">2–3 min</div>
            <div className="text-slate-600 font-medium">Target verification time per bidder</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function UserTypes() {
  return (
    <section className="py-24 bg-white border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Built for everyone involved in procurement</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-50 p-8 rounded-2xl border text-center flex flex-col h-full">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Procurement Officers</h3>
            <p className="text-slate-600 mb-8 flex-grow">Verify bidders faster and identify issues requiring attention.</p>
            <a href="/login" className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Officer Login
            </a>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-2xl border text-center flex flex-col h-full">
            <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Bidders / MSMEs</h3>
            <p className="text-slate-600 mb-8 flex-grow">Perform a preliminary self-check before submitting a bid.</p>
            <a href="/self-check" className="inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 text-slate-900">
              Start Self-Check
            </a>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border text-center flex flex-col h-full">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Government / CPSEs</h3>
            <p className="text-slate-600 mb-8 flex-grow">Improve transparency, traceability and procurement efficiency.</p>
            <div className="h-10"></div> {/* Spacer to align visually with buttons */}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Security() {
  return (
    <section id="security" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
        <Lock className="h-12 w-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">Built with security and accountability in mind.</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg py-4 px-2 text-sm font-medium">OAuth2</div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg py-4 px-2 text-sm font-medium">AES-256</div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg py-4 px-2 text-sm font-medium">Role-Based Access</div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg py-4 px-2 text-sm font-medium">Audit Trail</div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg py-4 px-2 text-sm font-medium col-span-2 md:col-span-1">Secure API Integration</div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-24 bg-primary text-primary-foreground text-center">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Make bid verification faster, clearer and more transparent.</h2>
        <p className="text-lg md:text-xl mb-10 text-primary-foreground/90">
          GeM Verify brings document verification, compliance assessment, risk analysis and auditability into one workflow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/login" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-bold text-primary shadow transition-colors hover:bg-slate-100">
            Login as Officer
          </a>
          <a href="/self-check" className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-transparent px-8 text-base font-bold shadow-sm transition-colors hover:bg-white/10">
            Try Bidder Self-Check
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">GeM Verify</span>
            </div>
            <p className="text-sm">AI-Powered Bid Compliance Verification Platform</p>
            <p className="text-sm font-semibold text-slate-300 mt-4">Smart India Hackathon 2026</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:text-right">
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white transition-colors text-sm">Home</a>
              <a href="#features" className="hover:text-white transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors text-sm">How It Works</a>
              <a href="#security" className="hover:text-white transition-colors text-sm">Security</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="/login" className="hover:text-white transition-colors text-sm text-primary">Officer Login</a>
              <a href="/self-check" className="hover:text-white transition-colors text-sm text-primary">Bidder Self-Check</a>
              <a href="#" className="hover:text-white transition-colors text-sm mt-2">Privacy</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
