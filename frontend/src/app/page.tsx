"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileText, Zap, Lock, ChevronRight, Activity, Search, ChevronDown, User, Landmark, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-500/30">
      {/* Top Gov Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-6 flex justify-between items-center tracking-wider border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-100 font-bold uppercase"><Landmark className="h-3.5 w-3.5 text-amber-500" /> Government of India</span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="hidden sm:inline uppercase">Ministry of Commerce and Industry</span>
          </div>
          <div className="hidden md:flex items-center gap-4 opacity-80">
            <a href="#" className="hover:text-white transition-colors">Skip to Main Content</a>
            <div className="flex items-center gap-2 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <a href="#" className="hover:text-white transition-colors px-1 border-r border-slate-600">A-</a>
              <a href="#" className="hover:text-white transition-colors px-1 border-r border-slate-600">A</a>
              <a href="#" className="hover:text-white transition-colors px-1">A+</a>
            </div>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-400 font-bold">English</span>
          </div>
        </div>
      </div>

      {/* Navigation - Gov Style */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo - Clickable to Home */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/logo.svg" alt="Gem-Verify Logo" className="h-12 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                GeM <span className="text-blue-600">Verify</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Govt. Procurement Portal</span>
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/officer/tenders" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wide flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Tenders
            </Link>

            {/* Register Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wide flex items-center focus:outline-none cursor-pointer">
                Register <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg rounded-md z-50">
                <DropdownMenuItem onClick={() => router.push('/auth/register')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <User className="mr-3 h-5 w-5 text-orange-500" />
                  <span className="font-medium text-slate-700">Register as Contractor (Bidder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/auth/register')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <Landmark className="mr-3 h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Register as Procurement Officer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-sm transition-colors flex items-center shadow-md focus:outline-none cursor-pointer">
                Login <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg rounded-md z-50">
                <DropdownMenuItem onClick={() => router.push('/auth/login')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <User className="mr-3 h-5 w-5 text-orange-500" />
                  <span className="font-medium text-slate-700">Login as Contractor (Bidder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/auth/login')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                  <Landmark className="mr-3 h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Login as Procurement Officer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Gov Theme */}
      <section className="bg-slate-50 text-slate-900 pt-24 pb-32 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
              Procurement Security, <span className="text-blue-700">Automated.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              GeM Verify is an AI-powered integrated bid compliance verification platform. Reduce manual tender review times from days to seconds with advanced document tampering detection and automated statutory checks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 text-lg rounded-sm transition-colors flex items-center justify-center shadow-md cursor-pointer focus:outline-none">
                  Access Portal <Lock className="ml-2 h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-white border-slate-200 shadow-lg rounded-md mt-2 z-50">
                  <DropdownMenuItem onClick={() => router.push('/auth/login')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                    <User className="mr-3 h-5 w-5 text-orange-500" />
                    <span className="font-medium text-slate-700">Contractor / MSME</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/auth/login')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full">
                    <Landmark className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="font-medium text-slate-700">Procurement Officer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="#features" className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-8 py-4 text-center transition-colors text-lg rounded-sm shadow-sm flex items-center justify-center">
                Explore Features
              </Link>
            </div>
          </div>
          
          {/* Right Visual Element */}
          <div className="hidden lg:flex justify-end animate-in fade-in duration-1000 delay-300">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden relative z-10 lg:h-[500px] flex flex-col">
                <div className="h-10 border-b border-slate-800 bg-slate-950 flex items-center px-4 space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full" />
                  <div className="h-3 w-3 bg-amber-500 rounded-full" />
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                  <div className="ml-4 flex-1 text-center font-mono text-xs text-slate-500">POST /api/officer/bids/verify</div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4 overflow-hidden">
                  
                  {/* AI Extract Mock */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-cyan-400 font-mono text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gemini 3.6 Flash</span>
                       <span className="text-xs text-slate-400 font-medium">PDF Parsed</span>
                     </div>
                     <div className="font-mono text-xs text-green-400 bg-slate-950 p-3 rounded overflow-hidden">
                       {`{
  "companyName": "Sharma Industrial",
  "gstin": "07AAAAA0000A1Z5",
  "tamperingSigns": false
}`}
                     </div>
                  </div>

                  {/* Gov API Checks */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                       <div className="flex items-center gap-3">
                         <CheckCircle className="w-5 h-5 text-green-500" />
                         <span className="text-slate-200 text-sm font-medium">Income Tax (PAN)</span>
                       </div>
                       <span className="text-xs text-slate-500 font-mono">200 OK</span>
                     </div>
                     <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                       <div className="flex items-center gap-3">
                         <CheckCircle className="w-5 h-5 text-green-500" />
                         <span className="text-slate-200 text-sm font-medium">MCA Registry</span>
                       </div>
                       <span className="text-xs text-slate-500 font-mono">200 OK</span>
                     </div>
                     <div className="flex items-center justify-between bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                       <div className="flex items-center gap-3">
                         <XCircle className="w-5 h-5 text-red-500" />
                         <span className="text-red-200 text-sm font-medium">GeM Blacklist Check</span>
                       </div>
                       <span className="text-xs text-red-400 font-mono">FLAGGED</span>
                     </div>
                  </div>

                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-cyan-800 p-5 shadow-2xl rounded-lg animate-bounce z-20">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-cyan-950 rounded flex items-center justify-center border border-cyan-800">
                    <Lock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-cyan-50 font-bold text-sm">Cryptographic Audit</div>
                    <div className="text-cyan-400/70 text-xs font-mono mt-1">SHA-256: 0x8F9B...4A21</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">Enterprise-Grade Verification</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded"></div>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg pt-4">
            Our platform integrates cutting-edge AI with statutory databases to ensure complete transparency and compliance in government procurement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group rounded-md">
            <div className="h-14 w-14 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <Search className="h-6 w-6 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Document Analysis</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Proprietary optical character recognition (OCR) and metadata analysis instantly flags forged, edited, or tampered PDF submissions.
            </p>
          </div>

          <div className="bg-slate-50 p-8 border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 group rounded-md">
            <div className="h-14 w-14 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
              <Activity className="h-6 w-6 text-orange-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Statutory API Checks</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Automated cross-verification of bidder data against government databases including GSTN, PAN, and Udyam Registration portals.
            </p>
          </div>

          <div className="bg-slate-50 p-8 border border-slate-200 hover:border-green-600 hover:shadow-lg transition-all duration-300 group rounded-md">
            <div className="h-14 w-14 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <FileText className="h-6 w-6 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Risk Scoring</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Machine learning models calculate a comprehensive compliance score, assigning Low, Medium, or High risk tags to every bid.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Gem-Verify Logo" className="h-8 w-auto object-contain drop-shadow-md" />
            <span className="text-xl font-bold tracking-tight text-white">GeM Verify</span>
          </div>
          <p className="font-medium text-slate-400">© 2026 Smart India Hackathon Prototype. Developed for the Government of India e-Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}
