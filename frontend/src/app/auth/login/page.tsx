"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // --- Email + Password Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // Check role from user metadata and redirect accordingly
      const role = data.user?.user_metadata?.role;
      if (role === 'officer') {
        router.push('/officer/dashboard');
      } else {
        router.push('/bidder/dashboard');
      }
    }
    setLoading(false);
  };

  // --- Magic Link Login ---
  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address first to send the magic link.');
      return;
    }
    setMagicLinkLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setMagicLinkLoading(false);
  };

  // --- Google OAuth Login ---
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
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-700">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <img src="/logo.svg" alt="Gem-Verify Logo" className="h-20 w-auto object-contain bg-transparent cursor-pointer hover:opacity-90 drop-shadow-md" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">Sign In</CardTitle>
          <CardDescription>Access the GeM Verify Procurement Portal</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* Magic Link Sent Success State */}
          {magicLinkSent ? (
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Check your inbox!</h3>
              <p className="text-slate-600 text-sm">
                A secure login link has been sent to <span className="font-semibold text-blue-700">{email}</span>. Click the link in your email to sign in instantly — no password needed.
              </p>
              <button
                className="text-sm text-blue-600 hover:underline font-medium"
                onClick={() => setMagicLinkSent(false)}
              >
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Email + Password Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="pl-9"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                      className="pl-9"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded p-2">{error}</p>
                )}

                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-11 text-base" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or</span>
                </div>
              </div>

              {/* Magic Link Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={handleMagicLink}
                disabled={magicLinkLoading}
              >
                <Mail className="mr-2 h-4 w-4 text-blue-600" />
                {magicLinkLoading ? "Sending link..." : "Send Magic Login Link to Email"}
              </Button>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>

        {!magicLinkSent && (
          <CardFooter className="flex justify-center border-t border-slate-100 pt-4 pb-6">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-800">
                Register here
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
