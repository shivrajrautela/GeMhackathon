export type Tender = {
  id: string;
  title: string;
  description: string;
  budget: string;
  department: string;
  deadline: string;
  bidsCount: number;
  avgRiskScore: number;
  status: 'Active' | 'Closed' | 'Under Review';
};

export type APIStatus = 'Verified' | 'Failed' | 'Pending' | 'Flagged';

export type VerificationData = {
  gstn: { status: APIStatus; details: string };
  udyam: { status: APIStatus; details: string };
  pan: { status: APIStatus; details: string };
};

export type DocumentFlags = {
  tamperingDetected: boolean;
  lowResolution: boolean;
  missingPages: boolean;
};

export type Bidder = {
  id: string;
  tenderId: string;
  companyName: string;
  submissionDate: string;
  complianceScore: number;
  riskTag: 'Low' | 'Medium' | 'High';
  verification: VerificationData;
  documentFlags: DocumentFlags;
  financialTurnover: string;
  matchedCriteria: string[];
  discrepancies: string[];
  status: 'Pending' | 'Approved' | 'Flagged' | 'Rejected';
};

export const mockTenders: Tender[] = [
  {
    id: 'TND-2026-001',
    title: 'Supply of Laptops for Education Dept',
    description: 'Procurement of 5000 high-performance laptops for public schools.',
    budget: '₹25,000,000',
    department: 'Ministry of Education',
    deadline: '2026-10-15',
    bidsCount: 12,
    avgRiskScore: 35,
    status: 'Under Review',
  },
  {
    id: 'TND-2026-002',
    title: 'Solar Panel Installation - Phase 3',
    description: 'Installation of solar grids in 50 rural districts.',
    budget: '₹120,000,000',
    department: 'Ministry of New and Renewable Energy',
    deadline: '2026-11-01',
    bidsCount: 8,
    avgRiskScore: 42,
    status: 'Active',
  },
  {
    id: 'TND-2026-003',
    title: 'Healthcare Software Modernization',
    description: 'Development and deployment of centralized patient records system.',
    budget: '₹85,000,000',
    department: 'Ministry of Health',
    deadline: '2026-09-30',
    bidsCount: 5,
    avgRiskScore: 20,
    status: 'Active',
  },
  {
    id: 'TND-2026-004',
    title: 'Highway CCTV Surveillance Network',
    description: 'Procurement and installation of AI-enabled traffic cameras.',
    budget: '₹55,000,000',
    department: 'Ministry of Road Transport',
    deadline: '2026-12-10',
    bidsCount: 20,
    avgRiskScore: 65,
    status: 'Under Review',
  },
  {
    id: 'TND-2026-005',
    title: 'Smart City Waste Management Fleet',
    description: 'Supply of 200 EV garbage collection trucks.',
    budget: '₹400,000,000',
    department: 'Ministry of Housing and Urban Affairs',
    deadline: '2026-10-05',
    bidsCount: 4,
    avgRiskScore: 15,
    status: 'Active',
  }
];

export const mockBidders: Bidder[] = [
  {
    id: 'BID-101',
    tenderId: 'TND-2026-001',
    companyName: 'TechCorp India Pvt Ltd',
    submissionDate: '2026-09-01',
    complianceScore: 95,
    riskTag: 'Low',
    verification: {
      gstn: { status: 'Verified', details: 'Active, regular returns filed' },
      udyam: { status: 'Verified', details: 'Valid, Medium Enterprise' },
      pan: { status: 'Verified', details: 'Matched with GSTN' }
    },
    documentFlags: {
      tamperingDetected: false,
      lowResolution: false,
      missingPages: false
    },
    financialTurnover: '₹50,000,000',
    matchedCriteria: ['Turnover > ₹20M', 'ISO 9001 Certified', '5+ Years Exp'],
    discrepancies: [],
    status: 'Pending'
  },
  {
    id: 'BID-102',
    tenderId: 'TND-2026-001',
    companyName: 'Globex IT Solutions',
    submissionDate: '2026-09-02',
    complianceScore: 65,
    riskTag: 'Medium',
    verification: {
      gstn: { status: 'Verified', details: 'Active' },
      udyam: { status: 'Failed', details: 'Registration expired' },
      pan: { status: 'Verified', details: 'Matched' }
    },
    documentFlags: {
      tamperingDetected: false,
      lowResolution: true,
      missingPages: false
    },
    financialTurnover: '₹15,000,000',
    matchedCriteria: ['ISO 9001 Certified'],
    discrepancies: ['Turnover < ₹20M', 'Udyam Cert Expired'],
    status: 'Pending'
  },
  {
    id: 'BID-103',
    tenderId: 'TND-2026-001',
    companyName: 'Shady Supplies LLC',
    submissionDate: '2026-09-04',
    complianceScore: 20,
    riskTag: 'High',
    verification: {
      gstn: { status: 'Flagged', details: 'Suspended due to non-filing' },
      udyam: { status: 'Failed', details: 'Not Found' },
      pan: { status: 'Flagged', details: 'Name mismatch' }
    },
    documentFlags: {
      tamperingDetected: true,
      lowResolution: false,
      missingPages: true
    },
    financialTurnover: '₹5,000,000',
    matchedCriteria: [],
    discrepancies: ['GST Suspended', 'Document Tampering Detected', 'PAN Mismatch', 'Turnover criteria not met'],
    status: 'Pending'
  },
  {
    id: 'BID-201',
    tenderId: 'TND-2026-002',
    companyName: 'SunPower Renewables',
    submissionDate: '2026-09-05',
    complianceScore: 88,
    riskTag: 'Low',
    verification: {
      gstn: { status: 'Verified', details: 'Active' },
      udyam: { status: 'Verified', details: 'Valid' },
      pan: { status: 'Verified', details: 'Matched' }
    },
    documentFlags: {
      tamperingDetected: false,
      lowResolution: false,
      missingPages: false
    },
    financialTurnover: '₹200,000,000',
    matchedCriteria: ['MNRE Empanelled', 'Turnover > ₹100M'],
    discrepancies: ['Missing project completion cert for last year'],
    status: 'Pending'
  }
];

export const getTenderById = (id: string) => mockTenders.find(t => t.id === id);
export const getBiddersByTender = (tenderId: string) => mockBidders.filter(b => b.tenderId === tenderId);
