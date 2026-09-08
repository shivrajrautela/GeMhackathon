import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockTenders = [
  {
    id: 't-1001',
    title: 'AI-Based Surveillance System for Traffic Intersections',
    department: 'Ministry of Road Transport and Highways',
    description: 'Procurement of AI-powered smart cameras and edge computing units for 500 major traffic intersections across metropolitan cities.',
    bidsCount: 14,
    budget: '₹45,00,00,000',
    deadline: '2026-10-15',
    status: 'Active',
    createdAt: new Date('2026-09-01')
  },
  {
    id: 't-1002',
    title: 'Cloud Infrastructure Provisioning for DigiLocker',
    department: 'Ministry of Electronics and IT',
    description: 'Scaling backend cloud infrastructure to support an additional 50 million active users. Requires highly available, fault-tolerant DB clusters.',
    bidsCount: 8,
    budget: '₹120,00,00,000',
    deadline: '2026-11-01',
    status: 'Active',
    createdAt: new Date('2026-09-02')
  },
  {
    id: 't-1003',
    title: 'Supply of Drones for Agricultural Mapping',
    department: 'Ministry of Agriculture',
    description: 'Procurement of 10,000 multispectral imaging drones to map crop health and soil moisture across rural districts.',
    bidsCount: 22,
    budget: '₹85,50,00,000',
    deadline: '2026-09-30',
    status: 'Under Review',
    createdAt: new Date('2026-08-15')
  }
];

const mockBidders = [
  {
    id: 'b-901',
    companyName: 'TechVision AI Solutions Pvt Ltd',
    tenderId: 't-1001',
    status: 'Pending',
    riskTag: 'Low',
    complianceScore: 94,
    gstn: '27AADCT4567R1Z9',
    pan: 'AADCT4567R',
    udyam: 'UDYAM-MH-18-0012345',
    flags: JSON.stringify([]),
    submittedAt: new Date('2026-09-05')
  },
  {
    id: 'b-902',
    companyName: 'Global InfraTech & Cloud',
    tenderId: 't-1002',
    status: 'Pending',
    riskTag: 'High',
    complianceScore: 42,
    gstn: 'INVALID_GSTN_FORMAT',
    pan: 'BBXPR1234T',
    udyam: 'UDYAM-DL-01-0987654',
    flags: JSON.stringify([
      { type: 'tampered', message: 'PDF metadata indicates modification via Photoshop CS6' },
      { type: 'missing', message: 'Turnover certificate for FY 24-25 is completely missing' }
    ]),
    submittedAt: new Date('2026-09-06')
  },
  {
    id: 'b-903',
    companyName: 'AeroDynamics India',
    tenderId: 't-1003',
    status: 'Approved',
    riskTag: 'Low',
    complianceScore: 98,
    gstn: '07BBPPA9876Q1Z2',
    pan: 'BBPPA9876Q',
    udyam: 'UDYAM-UP-04-1122334',
    flags: JSON.stringify([]),
    submittedAt: new Date('2026-08-20')
  },
  {
    id: 'b-904',
    companyName: 'Swift Networks Ltd',
    tenderId: 't-1001',
    status: 'Pending',
    riskTag: 'Medium',
    complianceScore: 76,
    gstn: '09AAACA1234P1Z5',
    pan: 'AAACA1234P',
    udyam: 'UDYAM-HR-05-5566778',
    flags: JSON.stringify([
      { type: 'warning', message: 'Minor mismatch in registered address vs GSTN record' }
    ]),
    submittedAt: new Date('2026-09-04')
  }
];

const mockAuditLogs = [
  { id: 'l-1', actor: 'AI Document Engine', event: 'Flagged Bidder b-902 for modified PDF metadata', severity: 'Critical', timestamp: new Date('2026-09-06T10:00:00Z') },
  { id: 'l-2', actor: 'System Auto-Check', event: 'Validated GSTN for Bidder b-901 via GST API', severity: 'Info', timestamp: new Date('2026-09-05T14:30:00Z') },
  { id: 'l-3', actor: 'Officer S. Sharma', event: 'Approved Bidder b-903 for Tender t-1003', severity: 'Info', timestamp: new Date('2026-08-25T09:15:00Z') },
  { id: 'l-4', actor: 'AI Risk Engine', event: 'Assigned High Risk tag to Bidder b-902 (Score: 42)', severity: 'Warning', timestamp: new Date('2026-09-06T10:05:00Z') },
];

async function main() {
  console.log('Seeding database...');
  
  for (const t of mockTenders) {
    await prisma.tender.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }

  for (const b of mockBidders) {
    await prisma.bidder.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    });
  }

  for (const log of mockAuditLogs) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {},
      create: log,
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
