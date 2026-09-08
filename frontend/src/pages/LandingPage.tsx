import React from 'react';
import type { Page } from '../lib/router';

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">H</div>
          <span className="font-bold text-lg tracking-tight">HackMVP</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('login')}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('login')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
          Built in 24 hours · Hackathon MVP
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Build{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            faster.
          </span>{' '}
          Ship{' '}
          <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            smarter.
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          A full-stack hackathon MVP with Supabase auth, real-time database, and
          Tailwind UI — ready to demo in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('login')}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-800/60 hover:-translate-y-0.5 text-base"
          >
            Start for free →
          </button>
          <button
            onClick={() => navigate('login')}
            className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-all text-base"
          >
            Sign in
          </button>
        </div>

        {/* Feature chips */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {['⚡ Vite + React', '🎨 Tailwind CSS', '🔐 Supabase Auth', '💾 Postgres DB', '☁️ Cloudflare'].map(f => (
            <span key={f} className="bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 text-xs py-6">
        Built with ❤️ at the hackathon · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
