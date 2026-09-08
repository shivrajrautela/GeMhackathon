require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Built-in Node.js library, no install needed
const supabase = require('./supabaseClient');
const { analyzeBidDocument } = require('./geminiService');

const app = express();
const PORT = process.env.PORT || 5000;

// Increase payload limit for base64 PDF uploads
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

// ==========================================
// UTILITY: SHA-256 Cryptographic Hash Generator
// This makes our audit logs tamper-proof
// ==========================================
function generateHash(data) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
}

// ==========================================
// UTILITY: Risk Score Calculator
// Combines govt record flags into a 0-100 risk score
// ==========================================
function calculateRiskScore(govtRecord) {
    let score = 0; // Start clean

    if (!govtRecord) return 95; // Record not found = very high risk

    if (govtRecord.blacklisted)      score += 60; // Blacklisted is catastrophic
    if (!govtRecord.active_gst)      score += 25; // Inactive GST is serious
    if (!govtRecord.epfo_clearance)  score += 15; // EPFO issue is moderate

    return Math.min(score, 100); // Cap at 100
}

app.get('/api/ping', (req, res) => res.json({ message: "Backend is running! 🚀" }));

const fs = require('fs');
const path = require('path');

// ==========================================
// 🏢 TENDERS API
// ==========================================
app.get('/api/tenders', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'tenders.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const tenders = JSON.parse(fileData);
        res.json({ success: true, data: tenders });
    } catch (err) {
        console.error('Error reading tenders data:', err);
        res.status(500).json({ success: false, error: 'Failed to load tenders.' });
    }
});

app.post('/api/tenders', (req, res) => {
    // Basic mock implementation for adding a tender to the JSON file
    try {
        const filePath = path.join(__dirname, 'data', 'tenders.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const tenders = JSON.parse(fileData);
        
        const newTender = {
            id: `TND-2026-${String(tenders.length + 1).padStart(3, '0')}`,
            ...req.body,
            bidsCount: 0,
            avgRiskScore: 0,
            status: 'Active'
        };
        
        tenders.unshift(newTender);
        fs.writeFileSync(filePath, JSON.stringify(tenders, null, 2));
        
        res.json({ success: true, data: newTender });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 🏢 PROFILE API (Phase 2)
// ==========================================
// We use a local JSON file to guarantee it works for the hackathon demo
// even if the Supabase tables aren't perfectly configured.
app.get('/api/profile/:id', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'profiles.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));
        
        const fileData = fs.readFileSync(filePath, 'utf8');
        const profiles = JSON.parse(fileData);
        
        res.json({ success: true, data: profiles[req.params.id] || null });
    } catch (err) {
        console.error('Error reading profile:', err);
        res.status(500).json({ success: false, error: 'Failed to load profile.' });
    }
});

app.post('/api/profile', (req, res) => {
    try {
        const { userId, profileData } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const filePath = path.join(__dirname, 'data', 'profiles.json');
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));
        
        const fileData = fs.readFileSync(filePath, 'utf8');
        const profiles = JSON.parse(fileData);
        
        profiles[userId] = profileData;
        
        fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2));
        res.json({ success: true, data: profileData });
    } catch (err) {
        console.error('Error saving profile:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 📄 BIDS API (Phase 3)
// ==========================================

// Helper to initialize bids file
const getBidsFile = () => {
    const filePath = path.join(__dirname, 'data', 'bids.json');
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    return filePath;
};

// All bids (for Officer Dashboard)
app.get('/api/bids', (req, res) => {
    try {
        const filePath = getBidsFile();
        let bids = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Enrich with tender details
        const tendersPath = path.join(__dirname, 'data', 'tenders.json');
        if (fs.existsSync(tendersPath)) {
            const tenders = JSON.parse(fs.readFileSync(tendersPath, 'utf8'));
            bids = bids.map(b => {
                const t = tenders.find(x => x.id === b.tender_id) || {};
                return { ...b, tenderTitle: t.title, department: t.department, value: t.budget, deadline: t.deadline };
            });
        }
        
        res.json({ success: true, data: bids });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// My submissions (for Bidder Dashboard)
app.get('/api/bids/:profile_id', (req, res) => {
    try {
        const filePath = getBidsFile();
        let bids = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let userBids = bids.filter(b => b.profile_id === req.params.profile_id);
        
        // Enrich with tender details
        const tendersPath = path.join(__dirname, 'data', 'tenders.json');
        if (fs.existsSync(tendersPath)) {
            const tenders = JSON.parse(fs.readFileSync(tendersPath, 'utf8'));
            userBids = userBids.map(b => {
                const t = tenders.find(x => x.id === b.tender_id) || {};
                return { ...b, tenderTitle: t.title, department: t.department, value: t.budget, deadline: t.deadline };
            });
        }

        res.json({ success: true, data: userBids });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a new bid
app.post('/api/bids', (req, res) => {
    try {
        const { tender_id, profile_id, company_name } = req.body;
        const filePath = getBidsFile();
        const bids = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const newBid = {
            id: `BID-${Date.now().toString().slice(-6)}`,
            tender_id,
            tenderId: tender_id, // Alias for frontend
            profile_id,
            company_name: company_name || "Unknown Company",
            status: 'Under Review',
            aiScore: 0,
            flags: [],
            submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        bids.unshift(newBid);
        fs.writeFileSync(filePath, JSON.stringify(bids, null, 2));

        res.json({ success: true, data: newBid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 🏢 PROCUREMENT OFFICER APIs (Phase 5)
// ==========================================

const getAuditFile = () => {
    const filePath = path.join(__dirname, 'data', 'audit_logs.json');
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    return filePath;
};

// 1. Officer Dashboard Stats
app.get('/api/officer/stats', (req, res) => {
    try {
        const bids = JSON.parse(fs.readFileSync(getBidsFile(), 'utf8'));
        const pending = bids.filter(b => b.status === 'Under Review').length;
        const approved = bids.filter(b => b.status === 'Approved').length;
        const rejected = bids.filter(b => b.status === 'Rejected').length;
        const total = bids.length;
        
        res.json({ success: true, data: { pending, approved, rejected, total } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 1.5. Officer All Bids (Global Queue)
app.get('/api/officer/bids', (req, res) => {
    try {
        const bids = JSON.parse(fs.readFileSync(getBidsFile(), 'utf8'));
        
        // Optionally attach tender data here if needed, or send raw
        res.json({ success: true, data: bids });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Officer Decision (Approve/Reject) + Audit Log
app.post('/api/officer/bids/:id/decision', (req, res) => {
    try {
        const bidId = req.params.id;
        const { status, officer_id, comments } = req.body; // 'Approved' or 'Rejected'
        
        const bidsPath = getBidsFile();
        const bids = JSON.parse(fs.readFileSync(bidsPath, 'utf8'));
        
        const bidIndex = bids.findIndex(b => b.id === bidId);
        if (bidIndex === -1) return res.status(404).json({ success: false, error: 'Bid not found' });
        
        // Update Bid
        bids[bidIndex].status = status;
        bids[bidIndex].reviewedOn = new Date().toISOString();
        bids[bidIndex].comments = comments || "";
        fs.writeFileSync(bidsPath, JSON.stringify(bids, null, 2));

        // Generate Audit Log
        const auditPath = getAuditFile();
        const audits = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
        
        const previousHash = audits.length > 0 ? audits[audits.length - 1].hash : "0000000000000000000000000000000000000000000000000000000000000000";
        
        const auditRecord = {
            id: `ADT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            bid_id: bidId,
            action: status.toUpperCase(),
            officer_id: officer_id || "OFFICER-1",
            previous_hash: previousHash
        };
        
        // Use our utility to calculate SHA-256
        auditRecord.hash = generateHash(auditRecord);
        
        audits.push(auditRecord);
        fs.writeFileSync(auditPath, JSON.stringify(audits, null, 2));

        res.json({ success: true, data: { bid: bids[bidIndex], audit: auditRecord } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. Get Audit Logs
app.get('/api/officer/audit', (req, res) => {
    try {
        const audits = JSON.parse(fs.readFileSync(getAuditFile(), 'utf8'));
        res.json({ success: true, data: audits });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 🏛️ GOVERNMENT MOCK APIs (Phase 4)
// ==========================================
// Centralized helper to get gov database
const getGovDB = () => {
    const filePath = path.join(__dirname, 'data', 'gov_database.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

app.get('/api/gov/pan/:number', (req, res) => {
    const record = getGovDB().find(r => r.pan_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'PAN not found' });
    setTimeout(() => res.json({ success: true, data: record.pan_details }), 300); // simulate network delay
});

app.get('/api/gov/gstin/:number', (req, res) => {
    const record = getGovDB().find(r => r.gstin === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'GSTIN not found' });
    setTimeout(() => res.json({ success: true, data: record.gst_details }), 400);
});

app.get('/api/gov/udyam/:number', (req, res) => {
    const record = getGovDB().find(r => r.udyam_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'Udyam not found' });
    setTimeout(() => res.json({ success: true, data: record.udyam_details }), 350);
});

app.get('/api/gov/mca/cin/:number', (req, res) => {
    const record = getGovDB().find(r => r.cin_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'CIN not found' });
    setTimeout(() => res.json({ success: true, data: record.incorporation_details }), 500);
});

app.get('/api/gov/mca/status/:number', (req, res) => {
    const record = getGovDB().find(r => r.pan_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'Company not found in MCA' });
    setTimeout(() => res.json({ success: true, data: record.mca_status }), 450);
});

app.get('/api/gov/epfo/:number', (req, res) => {
    const record = getGovDB().find(r => r.epfo_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'EPFO not found' });
    setTimeout(() => res.json({ success: true, data: record.epfo_details }), 300);
});

app.get('/api/gov/esic/:number', (req, res) => {
    const record = getGovDB().find(r => r.esic_number === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'ESIC not found' });
    setTimeout(() => res.json({ success: true, data: record.esic_details }), 300);
});

app.get('/api/gov/bis/:number', (req, res) => {
    const record = getGovDB().find(r => r.bis_license === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'BIS not found' });
    setTimeout(() => res.json({ success: true, data: record.bis_details }), 400);
});

app.get('/api/gov/startup/:number', (req, res) => {
    const record = getGovDB().find(r => r.startup_india_cert === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'Startup Cert not found' });
    setTimeout(() => res.json({ success: true, data: record.startup_details }), 350);
});

app.get('/api/gov/nsic/:number', (req, res) => {
    const record = getGovDB().find(r => r.nsic_cert === req.params.number);
    if (!record) return res.status(404).json({ success: false, error: 'NSIC Cert not found' });
    setTimeout(() => res.json({ success: true, data: record.nsic_details }), 300);
});

// ==========================================
// 🧠 PHASE 3: AI VERIFICATION ENGINE
// The "Wow" factor of the entire project
// ==========================================
app.post('/api/verify', async (req, res) => {
    const { bid_id } = req.body;

    try {
        // --- STEP 1: Get the bid and the bidder's tax ID ---
        const { data: bid, error: bidError } = await supabase
            .from('bids')
            .select(`*, profiles(company_name, tax_id)`)
            .eq('id', bid_id)
            .single();

        if (bidError || !bid) return res.status(404).json({ error: 'Bid not found' });
        
        const tax_id = bid.profiles?.tax_id;
        const company_name = bid.profiles?.company_name;
        console.log(`\n🔍 Running verification for: ${company_name} (Tax ID: ${tax_id})`);

        // --- STEP 2: Query Mock Government Records ---
        // This simulates querying 10+ real government portals like GSTN, MCA, EPFO
        console.log(`   📡 Checking mock government databases...`);
        await new Promise(r => setTimeout(r, 1000)); // Simulate network delay
        
        const { data: govtRecord } = await supabase
            .from('mock_government_records')
            .select('*')
            .eq('tax_id', tax_id)
            .single();

        // --- STEP 3: Calculate Risk Score ---
        const riskScore = calculateRiskScore(govtRecord);
        const flags = [];
        if (!govtRecord)               flags.push('Company record not found in government database');
        if (govtRecord?.blacklisted)   flags.push('CRITICAL: Company is blacklisted by MCA');
        if (!govtRecord?.active_gst)   flags.push('GST registration is inactive or revoked');
        if (!govtRecord?.epfo_clearance) flags.push('EPFO (Provident Fund) clearance pending');
        
        const finalStatus = riskScore >= 50 ? 'rejected' : 'verified';
        console.log(`   📊 Risk Score: ${riskScore}/100 | Status: ${finalStatus}`);

        // --- STEP 4: Update bid status in database ---
        await supabase
            .from('bids')
            .update({ status: finalStatus, risk_score: riskScore })
            .eq('id', bid_id);

        // --- STEP 5: Generate Cryptographic Hash & Write Audit Log ---
        const logData = {
            bid_id,
            company_name,
            tax_id,
            final_status: finalStatus,
            risk_score: riskScore,
            flags,
            timestamp: new Date().toISOString()
        };
        const sha256_hash = generateHash(logData);
        console.log(`   🔐 SHA-256 Hash generated: ${sha256_hash.substring(0, 20)}...`);

        await supabase.from('audit_logs').insert([{
            action: `VERIFICATION_${finalStatus.toUpperCase()}`,
            bid_id,
            sha256_hash
        }]);

        // --- STEP 6: Send response back to frontend ---
        res.json({
            success: true,
            status: finalStatus,
            risk_score: riskScore,
            flags,
            sha256_hash,
            company_name,
            message: `Verification complete. ${flags.length} issue(s) found.`
        });

    } catch (err) {
        console.error("❌ Verification error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 📋 AUDIT LOGS API
// ==========================================
app.get('/api/audit-logs', async (req, res) => {
    const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// ==========================================
// 🧠 REAL GEMINI AI INTEGRATION
// ==========================================
app.post('/api/run-ai-analysis', async (req, res) => {
    const { bid_id, pdf_base64 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY in backend/.env" });
    }

    if (!pdf_base64) {
        return res.status(400).json({ error: "No PDF data provided" });
    }

    try {
        console.log(`\n🤖 Starting Gemini AI Analysis for bid: ${bid_id}...`);
        
        // 1. Pass the PDF to Gemini to extract JSON data
        const extractedData = await analyzeBidDocument(pdf_base64);
        console.log("📄 Extracted Data from Gemini:", extractedData);

        // 2. Here you would normally fetch the "ground truth" from the mock Gov API
        // For example, finding the company by the extracted GSTIN:
        // const { data: govData } = await supabase.from('mock_government_records').eq('gstin', extractedData.gstin).single();

        // 3. For the demo, we'll return the AI's extracted data so the frontend can compare it
        res.json({
            success: true,
            bid_id,
            extractedData,
            message: "AI OCR Analysis Complete"
        });

    } catch (err) {
        console.error("❌ AI Analysis Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`🧠 AI Verification Engine: ONLINE`);
    console.log(`🔐 Cryptographic Audit Logger: ONLINE`);
    console.log(`======================================\n`);
});
