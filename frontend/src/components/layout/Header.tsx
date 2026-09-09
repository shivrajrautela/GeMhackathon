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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm animate-in slide-in-from-top duration-500">
      <div className="flex h-16 items-center px-8 justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo.svg" alt="Gem-Verify Logo" className="h-10 w-auto object-contain bg-transparent p-0.5" />
            <span className="ml-3 text-2xl font-black tracking-tighter text-slate-900">
              GeM <span className="text-blue-600">Verify</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 rounded-b-none"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <link.icon className={cn("mr-2 h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "flex items-center space-x-2 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors text-slate-700 hover:text-slate-900 shadow-sm")}>
              {isOfficer ? (
                <ShieldCheck className="h-4 w-4 text-blue-600" />
              ) : (
                <User className="h-4 w-4 text-orange-500" />
              )}
              <span className="font-semibold">{isOfficer ? 'Procurement Officer' : 'MSME Bidder'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-md shadow-xl border-slate-200 bg-white animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem onClick={() => router.push('/auth/login')} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-sm">
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
