"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileText, Zap, Lock, ChevronRight, Activity, Search, ChevronDown, User, Landmark } from 'lucide-react';
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
            <div className="inline-flex items-center px-4 py-1.5 bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-widest rounded-sm">
              <Zap className="mr-2 h-3 w-3" />
              Smart India Hackathon 2026
            </div>
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
            <div className="relative w-full max-w-lg aspect-square">
              {/* Abstract decorative elements simulating a secure dashboard */}
              <div className="absolute inset-0 bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col rounded-md">
                <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 space-x-2">
                  <div className="h-3 w-3 bg-red-400 rounded-full" />
                  <div className="h-3 w-3 bg-amber-400 rounded-full" />
                  <div className="h-3 w-3 bg-green-400 rounded-full" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="h-8 w-3/4 bg-slate-100 rounded" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-blue-50 border border-blue-100 rounded p-4 flex flex-col justify-end">
                      <div className="h-2 w-full bg-blue-200 rounded"><div className="h-full w-3/4 bg-blue-500 rounded" /></div>
                    </div>
                    <div className="h-24 bg-orange-50 border border-orange-100 rounded p-4 flex flex-col justify-end">
                      <div className="h-2 w-full bg-orange-200 rounded"><div className="h-full w-1/2 bg-orange-500 rounded" /></div>
                    </div>
                  </div>
                  <div className="h-32 w-full bg-slate-50 border border-slate-100 rounded" />
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-blue-200 p-6 shadow-xl rounded-md animate-bounce">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-lg">98.4% Accuracy</div>
                    <div className="text-slate-500 text-sm font-medium">AI Tamper Detection</div>
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
