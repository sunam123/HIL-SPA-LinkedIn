# Hindalco LinkedIn Post Generator

AI-powered LinkedIn post generator for Hindalco Specialty Alumina Business.

## Local Development

```bash
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Visit `http://localhost:5173`

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (from console.anthropic.com)
4. Click Deploy

That's it. Vercel auto-detects Vite and builds correctly.

## Project Structure

```
/
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # Main UI component
├── api/
│   └── generate.js       # Vercel serverless function (holds API key)
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## How It Works

```
User fills form → React (App.jsx)
      ↓
POST /api/generate
      ↓
Vercel Serverless Function (api/generate.js)
      ↓
Anthropic API (API key stays server-side)
      ↓
Generated post returned to UI
```
