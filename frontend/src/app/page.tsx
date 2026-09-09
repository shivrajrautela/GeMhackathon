"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileText, Zap, Lock, ChevronRight, Activity, Search, ChevronDown, User, Users, Landmark, Sparkles, CheckCircle, XCircle } from 'lucide-react';
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
      {/* Navigation - Gov Style */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo - Clickable to Home */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/logo.svg" alt="Gem-Verify Logo" className="h-12 w-auto object-contain drop-shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                GeM <span className="text-blue-600">Verify</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Govt. Procurement Portal</span>
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center space-x-8">
            <a href="#features" className="hidden md:flex text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide items-center">
              Features
            </a>
            
            <a href="#about" className="hidden md:flex text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide items-center">
              About
            </a>

            <Link href="/officer/tenders" className="text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide flex items-center">
              <Activity className="h-4 w-4 mr-1.5 text-blue-500 animate-pulse" />
              Live Tenders
            </Link>

            {/* Register Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-base font-bold text-slate-700 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide flex items-center focus:outline-none cursor-pointer">
                Register <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg rounded-md z-50">
                <DropdownMenuItem onClick={() => router.push('/auth/register')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full group">
                  <User className="mr-3 h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700">Register as Contractor (Bidder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/auth/register')} className="cursor-pointer hover:bg-slate-50 py-3 flex items-center w-full group">
                  <Landmark className="mr-3 h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700">Register as Procurement Officer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-blue-700 hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-lg text-white font-bold text-base px-7 py-2.5 rounded transition-all duration-300 flex items-center shadow-md focus:outline-none cursor-pointer">
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
      <section className="relative overflow-hidden bg-slate-50 text-slate-900 pt-24 pb-32 px-6 border-b border-slate-200">
        {/* Background Enlightenment Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          {/* Central Celestial Enlightenment Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-b from-amber-200/40 via-blue-200/30 to-transparent blur-[120px] rounded-full"></div>
          {/* Soft Amber & Cyan Aura behind Mockup */}
          <div className="absolute top-16 right-0 w-[550px] h-[500px] bg-gradient-to-br from-amber-300/25 via-sky-400/20 to-blue-500/15 blur-[100px] rounded-full"></div>
          {/* Subtle Left Fill Radiance */}
          <div className="absolute top-32 left-10 w-[400px] h-[400px] bg-blue-300/20 blur-[90px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl lg:text-[4rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Smarter Bid Verification.<br/>Faster Government Procurement.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              GeM Verify uses AI-powered document verification, automated compliance checks and risk assessment to help procurement officers verify bidders faster and with greater transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-center transition-colors text-base rounded shadow-md flex items-center justify-center">
                Officer Login
              </Link>
              <Link href="/auth/login" className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-8 py-4 text-center transition-colors text-base rounded shadow-sm flex items-center justify-center">
                Bidder Self-Check
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium pt-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Secure · Transparent · Evidence-Based</span>
            </div>
          </div>
          
          {/* Right Visual Element */}
          <div className="hidden lg:flex justify-end animate-in fade-in duration-1000 delay-300">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none animate-in fade-in zoom-in duration-1000 delay-300 -rotate-1 lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="animate-float w-full h-full relative">
                {/* Luminous Enlightenment Glow Directly Behind Mockup */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-300/35 via-sky-300/30 to-indigo-300/25 rounded-3xl blur-2xl -z-10"></div>
                <div className="bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden relative z-10 lg:h-[500px] flex flex-col ring-1 ring-slate-900/5 hover:shadow-2xl transition-shadow duration-500">
                  {/* Browser/Window Header */}
                  <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 space-x-2">
                    <div className="h-3 w-3 bg-slate-300 rounded-full" />
                    <div className="h-3 w-3 bg-slate-300 rounded-full" />
                    <div className="h-3 w-3 bg-slate-300 rounded-full" />
                    <div className="ml-4 flex-1 text-center font-sans text-xs text-slate-400 font-semibold uppercase tracking-widest">Verification Pipeline</div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col gap-5 overflow-hidden bg-slate-50/50">
                    
                    {/* AI Extract Mock - Light Mode */}
                    <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-5 relative overflow-hidden hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-default group">
                       <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                       <div className="flex items-center justify-between mb-4">
                         <span className="text-blue-700 font-bold text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gemini Analysis</span>
                         <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded border border-blue-100">Document Parsed</span>
                       </div>
                       <div className="font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-md overflow-hidden shadow-inner leading-relaxed group-hover:border-blue-200 transition-colors">
                         <span className="text-purple-600 font-semibold">const</span> extractedData = {`{`}
                         <br/>  <span className="text-blue-600">"company"</span>: <span className="text-green-600">"Sharma Industrial"</span>,
                         <br/>  <span className="text-blue-600">"gstin"</span>: <span className="text-green-600">"07AAAAA0000A1Z5"</span>,
                         <br/>  <span className="text-blue-600">"tampering"</span>: <span className="text-orange-500 font-bold">false</span>
                         <br/>{`}`}
                       </div>
                    </div>

                    {/* Gov API Checks - Light Mode */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between bg-white border border-slate-200 shadow-sm p-3.5 rounded-lg hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-default">
                         <div className="flex items-center gap-3">
                           <div className="bg-green-100 p-1.5 rounded-full"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                           <span className="text-slate-700 text-sm font-bold">Income Tax (PAN)</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="text-xs text-slate-500 font-mono font-medium">Verified</span>
                         </div>
                       </div>

                       <div className="flex items-center justify-between bg-white border border-slate-200 shadow-sm p-3.5 rounded-lg hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-default">
                         <div className="flex items-center gap-3">
                           <div className="bg-green-100 p-1.5 rounded-full"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                           <span className="text-slate-700 text-sm font-bold">MCA Registry</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="text-xs text-slate-500 font-mono font-medium">Verified</span>
                         </div>
                       </div>

                       <div className="flex items-center justify-between bg-red-50/80 border border-red-200 shadow-sm p-3.5 rounded-lg hover:-translate-y-1 hover:shadow-md hover:border-red-300 transition-all duration-300 cursor-default">
                         <div className="flex items-center gap-3">
                           <div className="bg-red-100 p-1.5 rounded-full"><XCircle className="w-4 h-4 text-red-600" /></div>
                           <span className="text-red-700 text-sm font-bold">GeM Blacklist Check</span>
                         </div>
                         <span className="text-[10px] text-red-600 font-bold bg-white px-2 py-1 rounded shadow-sm border border-red-200 tracking-wider">FLAGGED</span>
                       </div>
                    </div>

                  </div>
                </div>
                
                {/* Floating Cryptographic Audit - Light Mode */}
                <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-xl hover:-translate-y-3 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-default z-20 group">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                      <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-sm">Audit Log</div>
                      <div className="text-slate-500 text-xs font-mono mt-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-700 transition-colors">0x8F9B...4A21</div>
                    </div>
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

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">About Us</h2>
            <div className="w-16 h-1 bg-blue-600 rounded"></div>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              We are a team of passionate developers building solutions for the <strong className="text-slate-800">Internal Hackathon</strong>. GeM Verify addresses the critical need for automated, AI-driven bid verification in the Government e-Marketplace.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Manual verification of contractor documents is slow and susceptible to document forgery. Our platform leverages advanced Artificial Intelligence (Gemini 3.6 Flash) and cryptographic hashing to instantly parse, cross-verify, and secure tender submissions.
            </p>
            <div className="pt-4 flex gap-4">
              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex-1 text-center">
                <div className="text-3xl font-black text-blue-600 mb-1">98%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faster Verification</div>
              </div>
              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex-1 text-center">
                <div className="text-3xl font-black text-green-600 mb-1">100%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Trail</div>
              </div>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-8">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Meet The Team</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Internal Hackathon</p>
                </div>
              </div>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Shivraj Singh Rautela",
                  "Vaibhav Makholiya",
                  "Tarun Saini",
                  "Kunal Goswami",
                  "Gunjan",
                  "Kritika"
                ].map((name, i) => (
                  <li key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-lg shadow-sm hover:border-blue-300 transition-colors group cursor-default">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      {name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-700 text-sm leading-tight">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
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
          <p className="font-medium text-slate-400">© 2026 Internal Hackathon Prototype. Developed for the Government of India e-Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}
