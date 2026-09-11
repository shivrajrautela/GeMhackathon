import DashboardClient from "./DashboardClient";

export default async function OfficerDashboard() {
  let stats = { pending: 0, approved: 0, rejected: 0, total: 0 };
  let allBids = [];
  let auditLogs = [];
  let allTenders = [];

  try {
    const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/stats`, { cache: 'no-store' });
    const statsJson = await statsRes.json();
    if (statsJson.success) stats = statsJson.data;

    const bidsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/bids`, { cache: 'no-store' });
    const bidsJson = await bidsRes.json();
    if (bidsJson.success) allBids = bidsJson.data;

    const auditRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/officer/audit`, { cache: 'no-store' });
    const auditJson = await auditRes.json();
    if (auditJson.success) auditLogs = auditJson.data;

    const tendersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tenders`, { cache: 'no-store' });
    const tendersJson = await tendersRes.json();
    if (tendersJson.success) allTenders = tendersJson.data;

  } catch (error) {
    console.error("Failed to fetch from backend. Make sure port 5000 is running.", error);
  }

  const activeTenders = allTenders.filter(t => t.status !== 'Closed');
  const pendingBids = allBids.filter(b => b.status === 'Under Review');
  // Consider any bid with an AI score < 40 or specific flags as High Risk
  const highRiskBids = allBids.filter(b => b.aiScore < 40 && b.aiScore !== 0);

  // Group bids by tender for the chart
  const tenderCounts = {};
  allBids.forEach(b => {
    tenderCounts[b.tender_id] = (tenderCounts[b.tender_id] || 0) + 1;
  });

  const tenderData = Object.keys(tenderCounts).map(tenderId => {
    const t = allTenders.find(x => x.id === tenderId);
    return {
      name: t ? t.title.substring(0, 15) + '...' : tenderId,
      bids: tenderCounts[tenderId]
    };
  });

  return (
    <DashboardClient 
      stats={stats}
      activeTenders={activeTenders}
      pendingBids={pendingBids}
      highRiskBids={highRiskBids}
      allBids={allBids}
      auditLogs={auditLogs}
      tenderData={tenderData}
    />
  );
}
