"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'bidder' | 'officer'>('bidder');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Supabase Auth requires email and password.
    // We can save name and phone in the 'user_metadata'
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        data: {
          full_name: formData.name,
          phone: formData.phone,
          role: role,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg("Registration successful! Please check your email to verify your account, or log in if auto-confirmed.");
      setTimeout(() => {
        if (role === 'officer') router.push('/officer/dashboard');
        else router.push('/bidder/dashboard');
      }, 3000);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <img src="/logo.svg" alt="Gem-Verify Logo" className="h-20 w-auto object-contain bg-transparent cursor-pointer hover:opacity-90 drop-shadow-md" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Create an Account</CardTitle>
          <CardDescription>Register for the GeM Verify Portal</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex bg-slate-100 p-1 rounded-md mb-6">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${role === 'bidder' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setRole('bidder')}
            >
              Contractor (MSME)
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${role === 'officer' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setRole('officer')}
            >
              Procurement Officer
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="name" required placeholder="Enter your full name" className="pl-9" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="phone" required type="tel" placeholder="Enter mobile number" className="pl-9" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="email" required type="email" placeholder="name@example.com" className="pl-9" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="password" required type="password" placeholder="Create a strong password" className="pl-9" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}

            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={loading}>
              {loading ? "Registering..." : `Register as ${role === 'officer' ? 'Officer' : 'Bidder'}`}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
            </div>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-4 pb-6">
          <p className="text-sm text-slate-600">
            Already have an account? <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-800">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
