import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// ===== TYPES =====
interface Tender { id: string; title: string; description: string; deadline: string; }
interface Bid {
  id: string; status: string; risk_score: number | null; document_url: string; created_at: string;
  profiles: { company_name: string; tax_id: string } | null;
  tenders: { title: string } | null;
}
interface AuditLog { id: string; action: string; bid_id: string; sha256_hash: string; created_at: string; }

type Tab = 'overview' | 'tenders' | 'bids' | 'audit';

// ===== BADGE COMPONENT =====
function RiskBadge({ score, status }: { score: number | null; status: string }) {
  if (status === 'pending') return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 font-medium">Pending</span>;
  if (score === null) return null;
  if (score < 25) return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-medium">Low Risk ({score})</span>;
  if (score < 50) return <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400 font-medium">Medium Risk ({score})</span>;
  return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 font-medium">High Risk ({score})</span>;
}

// ===== MAIN DASHBOARD =====
export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<Record<string, any>>({});

  // ===== AUTH CHECK =====
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate('/login'); } 
      else { setUser(data.session.user); setLoading(false); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate('/login');
      else { setUser(session.user); setLoading(false); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ===== DATA FETCHING =====
  const fetchAll = useCallback(async () => {
    const [t, b, a] = await Promise.all([
      fetch('/api/tenders').then(r => r.json()),
      fetch('/api/bids').then(r => r.json()),
      fetch('/api/audit-logs').then(r => r.json()),
    ]);
    if (t.success) setTenders(t.data);
    if (b.success) setBids(b.data);
    if (a.success) setAuditLogs(a.data);
  }, []);

  useEffect(() => { if (!loading) fetchAll(); }, [loading]);

  // ===== AI VERIFY =====
  const handleVerify = async (bidId: string) => {
    setVerifyingId(bidId);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bid_id: bidId })
      });
      const data = await res.json();
      setVerifyResult(prev => ({ ...prev, [bidId]: data }));
      await fetchAll(); // Refresh dashboard data
    } catch (e) {
      console.error('Verify failed:', e);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  // ===== METRICS =====
  const pendingCount = bids.filter(b => b.status === 'pending').length;
  const highRiskCount = bids.filter(b => (b.risk_score ?? 0) >= 50).length;
  const verifiedCount = bids.filter(b => b.status === 'verified').length;

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* TOP NAV */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">G</div>
          <div>
            <span className="font-bold text-lg tracking-tight">GeM Verify</span>
            <span className="ml-3 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">Procurement Officer</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{user?.email}</span>
          <button onClick={handleLogout} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">Sign Out</button>
        </div>
      </nav>

      {/* TABS */}
      <div className="border-b border-slate-800 px-6">
        <div className="flex gap-1">
          {([['overview','📊 Overview'], ['tenders','🏛️ Tenders'], ['bids','👥 Bidders & Verification'], ['audit','🔐 Audit Trail']] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Tenders', value: tenders.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Pending Verification', value: pendingCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { label: 'Verified Bidders', value: verifiedCount, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'High Risk Alerts', value: highRiskCount, color: 'text-red-400', bg: 'bg-red-500/10' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} border border-slate-700 rounded-xl p-5`}>
                  <p className="text-slate-400 text-sm">{label}</p>
                  <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className={`bg-slate-800/50 border rounded-xl p-4 ${auditLogs.length > 0 ? 'border-green-500/30' : 'border-slate-700'}`}>
              <p className="text-sm font-medium text-slate-300">🔐 Cryptographic Audit Trail</p>
              <p className="text-xs text-slate-500 mt-1">{auditLogs.length} tamper-proof events recorded — SHA-256 hashed and immutable.</p>
            </div>
          </div>
        )}

        {/* ===== TENDERS TAB ===== */}
        {activeTab === 'tenders' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Active Government Tenders</h1>
            {tenders.length === 0 ? (
              <p className="text-slate-400">No tenders yet. Seed your database using seed.sql</p>
            ) : (
              <div className="space-y-4">
                {tenders.map(tender => (
                  <div key={tender.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{tender.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{tender.description}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-4">Deadline: {tender.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== BIDS / VERIFICATION TAB ===== */}
        {activeTab === 'bids' && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Bidder Verification Center</h1>
            {bids.length === 0 ? (
              <p className="text-slate-400">No bids submitted yet.</p>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700">
                    <tr className="text-left text-slate-400">
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Tax ID</th>
                      <th className="px-5 py-3">Tender</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {bids.map(bid => (
                      <tr key={bid.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4 font-medium">{bid.profiles?.company_name ?? 'Unknown'}</td>
                        <td className="px-5 py-4 text-slate-400 font-mono text-xs">{bid.profiles?.tax_id ?? '-'}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{bid.tenders?.title?.substring(0, 35) ?? '-'}...</td>
                        <td className="px-5 py-4"><RiskBadge score={bid.risk_score} status={bid.status} /></td>
                        <td className="px-5 py-4">
                          {bid.status === 'pending' ? (
                            <button onClick={() => handleVerify(bid.id)} disabled={verifyingId === bid.id}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                              {verifyingId === bid.id ? (
                                <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> Scanning...</>
                              ) : '🧠 Run AI Verify'}
                            </button>
                          ) : (
                            <span className={`text-xs ${bid.status === 'verified' ? 'text-green-400' : 'text-red-400'}`}>
                              {bid.status === 'verified' ? '✅ Cleared' : '❌ Rejected'}
                            </span>
                          )}
                          {/* Show AI result flags if just verified */}
                          {verifyResult[bid.id] && (
                            <div className="mt-2 text-xs text-slate-400">
                              {verifyResult[bid.id].flags?.map((f: string, i: number) => <p key={i}>⚠️ {f}</p>)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== AUDIT TRAIL TAB ===== */}
        {activeTab === 'audit' && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Cryptographic Audit Trail</h1>
            <p className="text-slate-400 text-sm mb-6">Every action is sealed with a SHA-256 hash. Tamper-proof and immutable.</p>
            {auditLogs.length === 0 ? (
              <p className="text-slate-400">No audit logs yet. Run an AI verification to generate the first cryptographic entry!</p>
            ) : (
              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${log.action.includes('VERIFIED') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 break-all">🔐 SHA-256: {log.sha256_hash}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
