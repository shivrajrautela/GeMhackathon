require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
// We use port 5000 for the backend (Frontend usually uses 5173 or 3000)
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
// CORS allows your React frontend to communicate with this backend securely
app.use(cors()); 
// This allows your backend to read JSON data sent in POST requests
app.use(express.json()); 


// === DEMO API ROUTES ===

// 1. A simple GET route to test if the server is alive
app.get('/api/ping', (req, res) => {
    res.json({ message: "Backend is running successfully on localhost:5000! 🚀" });
});

// 2. A Demo POST route for submitting a bid
app.post('/api/bids', (req, res) => {
    // req.body contains the data sent from the React frontend
    const { companyName, taxId } = req.body;
    
    // Log it to your terminal so you can see it working!
    console.log(`📥 Received new bid from: ${companyName} (Tax ID: ${taxId})`);
    
    // Send a success response back to the frontend
    res.json({
        success: true,
        message: "Bid received by the backend successfully!",
        data: {
            companyName: companyName,
            status: "pending_verification"
        }
    });
});


// === START THE SERVER ===
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 Backend Server running!`);
    console.log(`👉 Test Link: http://localhost:${PORT}/api/ping`);
    console.log(`======================================\n`);
});
