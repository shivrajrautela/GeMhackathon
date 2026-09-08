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
// 📄 BIDS API
// ==========================================
// All bids (for Officer Dashboard)
app.get('/api/bids', async (req, res) => {
    const { data, error } = await supabase
        .from('bids')
        .select(`*, profiles(company_name, tax_id), tenders(title)`)
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// My submissions (for Bidder Dashboard)
app.get('/api/bids/:profile_id', async (req, res) => {
    const { data, error } = await supabase
        .from('bids')
        .select(`*, tenders(title)`)
        .eq('profile_id', req.params.profile_id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// Submit a new bid
app.post('/api/bids', async (req, res) => {
    const { tender_id, profile_id, document_url } = req.body;
    const { data, error } = await supabase
        .from('bids')
        .insert([{ tender_id, profile_id, document_url, status: 'pending', risk_score: null }])
        .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data: data[0] });
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
