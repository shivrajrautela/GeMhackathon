import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle, AlertTriangle, Clock, Zap, Target, Search, BarChart3, Database } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">GeM Verify</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#security" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/self-check" className="hidden md:inline-flex text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Bidder Self-Check
          </a>
          <a href="/login" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Officer Login
          </a>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              Smarter Bid Verification. <br className="hidden md:block"/> Faster Government Procurement.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              GeM Verify uses AI-powered document verification, automated compliance checks and risk assessment to help procurement officers verify bidders faster and with greater transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="/login" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90">
                Officer Login
              </a>
              <a href="/self-check" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-base font-medium shadow-sm transition-colors hover:bg-slate-100">
                Bidder Self-Check
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Secure • Transparent • Evidence-Based</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:ml-auto w-full max-w-lg shadow-2xl rounded-xl border bg-white overflow-hidden"
          >
            <div className="bg-slate-100 border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-medium text-slate-500">GeM Verify Dashboard</div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Active Tenders</div>
                  <div className="text-2xl font-bold text-blue-900">14</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="text-sm text-slate-600 font-medium mb-1">Bidders Verifying</div>
                  <div className="text-2xl font-bold text-slate-900">342</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Verification Progress</span>
                  <span className="text-primary">68%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-semibold">TCS Ltd.</div>
                      <div className="text-xs text-slate-500">Compliance: 98/100</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">Low Risk</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="text-sm font-semibold text-amber-900">Global Tech Solutions</div>
                      <div className="text-xs text-amber-700">Compliance: 82/100</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 bg-amber-200 text-amber-800 rounded">Medium Risk</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Problem() {
  const problems = [
    {
      num: "01",
      title: "Too Many Bids",
      desc: "A single tender may receive a large number of bids, creating significant manual verification workload."
    },
    {
      num: "02",
      title: "Manual Document Checking",
      desc: "Officers need to cross-check multiple documents and registrations across different sources."
    },
    {
      num: "03",
      title: "Risk of Human Error",
      desc: "Heavy workloads can increase the possibility of missed discrepancies or incorrect verification."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Bid verification shouldn't take days.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
            >
              <div className="text-5xl font-extrabold text-slate-200 mb-6">{p.num}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">— {p.title}</h3>
              <p className="text-slate-600 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Solution() {
  const steps = [
    "Upload / Import Bid",
    "Document Processing",
    "AI Verification",
    "Government Data Verification",
    "Compliance Assessment",
    "Risk Scoring",
    "Officer Review"
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">One platform. Complete bidder verification.</h2>
        
        {/* Desktop workflow */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-wrap max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="bg-slate-800 px-4 py-3 rounded-lg border border-slate-700 text-sm font-medium whitespace-nowrap">
                {step}
              </div>
              {i < steps.length - 1 && (
                <div className="text-slate-600">→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden flex flex-col items-center gap-4">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="bg-slate-800 px-6 py-4 rounded-lg border border-slate-700 font-medium w-full max-w-sm">
                {step}
              </div>
              {i < steps.length - 1 && (
                <div className="text-slate-600 h-6 border-l-2 border-slate-700"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    { icon: <Database />, title: "Automated Verification", desc: "Automatically verify bidder information against available authorized data sources." },
    { icon: <FileText />, title: "AI Document Verification", desc: "OCR, document analysis, authenticity checks and tamper detection." },
    { icon: <CheckCircle />, title: "Compliance Assessment", desc: "Evaluate bidder compliance against tender-specific requirements." },
    { icon: <AlertTriangle />, title: "Risk Scoring", desc: "Identify inconsistencies and generate an evidence-based risk score." },
    { icon: <Search />, title: "Transparent Audit Trail", desc: "Maintain a complete record of verification activities." },
    { icon: <Zap />, title: "Faster Procurement", desc: "Reduce repetitive manual verification work so officers can focus on evaluation and decision-making." },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Everything required for faster bid verification</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { num: "1", title: "Select Tender", desc: "Choose the tender that requires bidder verification." },
    { num: "2", title: "Process Bids", desc: "Import or upload bidder information and documents." },
    { num: "3", title: "Verify Automatically", desc: "AI and integrated verification services analyze documents and bidder information." },
    { num: "4", title: "Review & Decide", desc: "The procurement officer reviews the evidence, compliance status and risk assessment before making the final decision." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">How GeM Verify works</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold mb-6 relative z-10">
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-12 right-0 h-[2px] bg-slate-100 -z-0"></div>
              )}
              <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-6 text-center flex flex-col md:flex-row items-center gap-4 justify-center">
          <ShieldCheck className="h-8 w-8 text-blue-600 shrink-0" />
          <p className="text-blue-900 font-medium text-sm md:text-base text-left">
            <strong>Important:</strong> AI assists the procurement officer and does not independently make the final procurement decision.
          </p>
        </div>
      </div>
    </section>
  );
}
