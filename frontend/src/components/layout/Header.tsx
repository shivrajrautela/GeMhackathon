"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown, User, ShieldCheck, LayoutDashboard, FileText, Users, Activity, UploadCloud, FileCheck, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isOfficer = pathname.startsWith('/officer');

  const officerLinks = [
    { name: 'Dashboard', href: '/officer/dashboard', icon: LayoutDashboard },
    { name: 'Tenders', href: '/officer/tenders', icon: FileText },
    { name: 'Bidders', href: '/officer/bidders', icon: Users },
    { name: 'Audit Logs', href: '/officer/audit', icon: Activity },
  ];

  const bidderLinks = [
    { name: 'Dashboard', href: '/bidder/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', href: '/bidder/profile', icon: Users },
    { name: 'Submit Bid', href: '/bidder/apply', icon: UploadCloud },
    { name: 'My Submissions', href: '/bidder/submissions', icon: FileCheck },
  ];

  const links = isOfficer ? officerLinks : bidderLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 shadow-md animate-in slide-in-from-top duration-500">
      <div className="flex h-16 items-center px-8 justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-none bg-cyan-500 flex items-center justify-center shadow-sm shadow-cyan-900/50">
              <ShieldCheck className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              GeM <span className="text-cyan-400 font-medium">Verify</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-none text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-slate-800 text-cyan-400 border-b-2 border-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  )}
                >
                  <link.icon className={cn("mr-2 h-4 w-4", isActive ? "text-cyan-400" : "text-slate-500")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "flex items-center space-x-2 bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-none transition-colors text-slate-200 hover:text-white")}>
              {isOfficer ? (
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              ) : (
                <User className="h-4 w-4 text-amber-400" />
              )}
              <span className="font-semibold">{isOfficer ? 'Procurement Officer' : 'MSME Bidder'}</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none shadow-xl border-slate-700 bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Switch Context</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={() => router.push('/officer/dashboard')} className="cursor-pointer rounded-none focus:bg-slate-800 text-slate-200 focus:text-cyan-400">
                  <ShieldCheck className="mr-2 h-4 w-4 text-cyan-400" />
                  <span className="font-medium">Procurement Officer</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/bidder/dashboard')} className="cursor-pointer rounded-none focus:bg-slate-800 text-slate-200 focus:text-amber-400">
                  <User className="mr-2 h-4 w-4 text-amber-400" />
                  <span className="font-medium">Bidder / MSME</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem onClick={() => router.push('/auth/login')} className="text-rose-400 focus:bg-rose-950 focus:text-rose-300 cursor-pointer rounded-none">
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
