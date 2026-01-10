

# Aadhar ML Verification - Team Setup Guide

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │ ──→  │  Vite Proxy      │ ──→  │   ML Server     │
│  (React :5173)  │      │  /extract → 5000 │      │  (Flask :5000)  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

**Teammates access ONLY the frontend URL. ML API calls are automatically forwarded!**

## Team Setup (Do This)

### Step 1: Clone & Install
```bash
git clone <repo-url>
cd Census-System-1
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Add your Supabase credentials to .env
```

### Step 3: Run Everything
```bash
# Terminal 1: Start ML API (port 5000)
cd ML
python app.py

# Terminal 2: Start Frontend (port 5173)
npm run dev
```

### Step 4: Access
Open **http://localhost:5173** in your browser.

**That's it!** The ML API is automatically proxied:
- Frontend calls `/extract`
- Vite forwards to `http://localhost:5000/extract`

## ML Server Deployment (Optional - For Production)

Only deploy this if you want teammates to access ML API without running Python locally:

```bash
# Deploy ML folder to Railway/Render/Heroku
cd ML
# Deploy to cloud...

# Update .env for production
VITE_ML_API_URL=https://your-ml-api.herokuapp.com/extract
```

## Key Files Modified

| File | Purpose |
|------|---------|
| `src/pages/Census.tsx` | ML API integration |
| `ML/engine.py` | Name extraction (EasyOCR + Tesseract) |
| `vite.config.ts` | API proxy configuration |
| `.env.example` | Environment template |

## Test Result
```json
{
  "Aadhaar Number": "342506531151",
  "Name": "Sid Malhorta"
}
```


