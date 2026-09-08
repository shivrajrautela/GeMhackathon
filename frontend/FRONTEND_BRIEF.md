# 🎨 Frontend Developer Guide (Multi-Tenant Update)

We have upgraded the architecture to support two roles: **Bidders** and **Procurement Officers**. 

## 1. Authentication (CRITICAL)
Do **NOT** wait for a Node.js login API. We are bypassing the backend for login.
*   Use the **Supabase Auth SDK** (`@supabase/supabase-js`) directly in your React app.
*   `supabase.auth.signInWithPassword({ email, password })`
*   Use this for both the **Bidder Login Page** and the **Officer Login Page**.

## 2. Pages to Build & API Contracts

Whenever you need data, fetch it from these Node.js endpoints (`http://localhost:5000/api/...`). If the endpoint isn't running yet, hardcode dummy data in React to keep designing!

### 🏢 Bidder Portal
*   **Company Profile:** Just use Supabase Auth metadata for now to show their name/email.
*   **Available Tenders (To Bid On):** 
    *   `GET /api/tenders` $\rightarrow$ Returns a list of jobs `[{ id, title, description }]`.
*   **Submit Document/Bid:**
    *   `POST /api/bids` $\rightarrow$ Send `{ tender_id, profile_id, document_url }`.
    *   *(Note: Fake the file upload UI for now. Just pass a dummy "doc.pdf" string to the backend).*
*   **My Submissions:**
    *   `GET /api/bids/<user_id_here>` $\rightarrow$ Returns their specific bids and current status.

### 🏛️ Procurement Officer Dashboard
*   **Tenders Management:**
    *   `POST /api/tenders` $\rightarrow$ Create a new job `{ title, description, deadline }`.
*   **Bidders List:**
    *   `GET /api/bids` $\rightarrow$ Returns every bid submitted by all companies.
*   **Run Verification (The "Wow" button):**
    *   `POST /api/verify` $\rightarrow$ Send `{ bid_id }`. Shows a loading spinner while the AI works!
*   **Audit Logs Page:**
    *   `GET /api/audit-logs` $\rightarrow$ Returns the cryptographic history.

### 💡 Hackathon Tip
Don't get stuck on complex state management (like Redux). Just use React `useState` and `useEffect` to fetch from the backend endpoints!
