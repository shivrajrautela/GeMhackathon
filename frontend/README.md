# Hackathon MVP Setup

## Prerequisites
- Node.js and npm installed.

## Setup Steps
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` and add Supabase keys.
4. `npm run dev`

## Cloudflared Tunnel (for sharing local dev)
`cloudflared tunnel --url http://localhost:5173`
