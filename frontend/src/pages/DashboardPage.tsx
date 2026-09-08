import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('login');
      } else {
        setUser(data.session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes (e.g. magic link redirect)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">H</div>
          <span className="font-bold text-lg tracking-tight">HackMVP</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm truncate max-w-[200px]">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back 👋
          </h1>
          <p className="text-slate-400 text-sm">
            You're authenticated as <span className="text-purple-400 font-medium">{user?.email}</span>
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Auth Provider', value: user?.app_metadata?.provider || 'email', icon: '🔐' },
            { label: 'User ID', value: user?.id?.slice(0, 8) + '...', icon: '🪪' },
            { label: 'Status', value: 'Active', icon: '✅' },
          ].map(card => (
            <div key={card.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="text-2xl mb-3">{card.icon}</div>
              <div className="text-xs text-slate-400 mb-1">{card.label}</div>
              <div className="font-semibold text-sm text-white truncate">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Placeholder Feature Area */}
        <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2">Your app lives here</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Add your core hackathon features in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-purple-400 text-xs">src/pages/DashboardPage.tsx</code>
          </p>
        </div>
      </main>
    </div>
  );
}
