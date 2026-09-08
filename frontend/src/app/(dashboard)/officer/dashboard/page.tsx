import DashboardClient from "./DashboardClient";

export default async function OfficerDashboard() {
  // Fetch real data from our Node.js + Supabase backend!
  let allTenders = [];
  let allBidders = [];

  try {
    const tendersRes = await fetch('http://localhost:5000/api/tenders', { cache: 'no-store' });
    const tendersJson = await tendersRes.json();
    if (tendersJson.success) {
      allTenders = tendersJson.data.map((t: any) => ({
        id: t.id,
        title: t.title,
        status: 'Active',
        bidsCount: 0 // We can calculate this below if needed
      }));
    }

    const bidsRes = await fetch('http://localhost:5000/api/bids', { cache: 'no-store' });
    const bidsJson = await bidsRes.json();
    if (bidsJson.success) {
      allBidders = bidsJson.data.map((b: any) => ({
        id: b.id,
        companyName: b.profiles?.company_name || 'Unknown',
        status: b.status === 'pending' ? 'Pending' : (b.status === 'verified' ? 'Approved' : 'Rejected'),
        riskTag: b.risk_score === null ? 'Pending' : (b.risk_score < 30 ? 'Low' : (b.risk_score < 60 ? 'Medium' : 'High')),
        complianceScore: b.risk_score === null ? 0 : 100 - b.risk_score,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch from backend. Make sure port 5000 is running.", error);
  }

  const activeTenders = allTenders.filter(t => t.status === 'Active' || t.status === 'Under Review');
  const pendingBids = allBidders.filter(b => b.status === 'Pending');
  const highRiskBids = allBidders.filter(b => b.riskTag === 'High');

  const tenderData = allTenders.map(t => ({
    name: t.title.substring(0, 20) + '...',
    bids: t.bidsCount
  }));

  return (
    <DashboardClient 
      activeTenders={activeTenders}
      pendingBids={pendingBids}
      highRiskBids={highRiskBids}
      allBidders={allBidders}
      tenderData={tenderData}
    />
  );
}
