import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

type AuthMode = 'magic' | 'password';

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { setError('Supabase keys missing in .env'); return; }
    setLoading(true); setError(''); setSuccess('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' }
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess('Magic link sent! Check your inbox.');
  };

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { setError('Supabase keys missing in .env'); return; }
    setLoading(true); setError(''); setSuccess('');
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else if (result.data.session) {
      navigate('/dashboard'); // ✅ React Router navigation
    } else {
      setSuccess('Check your email to confirm your account.');
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) { setError('Supabase keys missing in .env'); return; }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center font-bold text-white">G</div>
            <span className="font-bold text-lg text-white tracking-tight">GeM Verify</span>
          </button>
          <p className="mt-3 text-slate-400 text-sm">
            {isSignUp ? 'Create your officer account' : 'Sign in to your account'}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-2xl">

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-medium py-2.5 rounded-xl transition-all mb-5 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-900/60 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setMode('magic'); setError(''); setSuccess(''); }}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${mode === 'magic' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Magic Link
            </button>
            <button
              onClick={() => { setMode('password'); setError(''); setSuccess(''); }}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${mode === 'password' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Password
            </button>
          </div>

          {/* Magic Link Form */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {loading ? 'Sending...' : 'Send Magic Link ✉️'}
              </button>
            </form>
          )}

          {/* Password Form */}
          {mode === 'password' && (
            <form onSubmit={handleEmailPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                className="w-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </form>
          )}

          {/* Feedback */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs">
              {success}
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Government Tender Bidder Verification Portal
        </p>
      </div>
    </div>
  );
}
