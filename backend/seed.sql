-- ============================================
-- SEED DEMO DATA FOR HACKATHON PRESENTATION
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Insert realistic Government Tenders
INSERT INTO tenders (title, description, deadline) VALUES
(
  'National Highway Solar Lighting Project 2026',
  'Supply and installation of 10,000 solar LED street lights across 450km of national highways in Rajasthan. Vendor must have MSME certification and GST clearance.',
  '2026-10-15'
),
(
  'Smart City High-Speed Networking Infrastructure',
  'Design and deployment of fiber optic and 5G network infrastructure for 3 Tier-2 smart cities. Minimum 5 years of prior telecom project experience required.',
  '2026-10-30'
),
(
  'e-Governance Digital Records Management System',
  'Development and maintenance of a cloud-based document management system for 12 district government offices. ISO 27001 certified vendors preferred.',
  '2026-11-05'
);

-- 2. Insert Mock Government Records (The "simulated API database")
-- These are the records our backend will cross-reference against
INSERT INTO mock_government_records (tax_id, legal_name, blacklisted, active_gst, epfo_clearance) VALUES
-- Vendor A: Clean record - should PASS verification
('GSTIN22AAAAA0000A1Z5', 'TechBridge Infrastructure Pvt. Ltd.', false, true, true),

-- Vendor B: BLACKLISTED - should FAIL verification (flagged by MCA)
('GSTIN22BBBBB0000B1Z6', 'ShadowBuild Constructions Ltd.', true, true, false),

-- Vendor C: Inactive GST - should FAIL verification
('GSTIN22CCCCC0000C1Z7', 'FakeGST Digital Services', false, false, true),

-- Vendor D: Minor risk - EPFO not cleared but GST active
('GSTIN22DDDDD0000D1Z8', 'Sunrise Telecom Solutions', false, true, false);
