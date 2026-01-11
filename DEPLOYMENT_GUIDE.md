# Census System - Complete Deployment Guide

This guide will help you deploy your Census System with ML backend on Hugging Face Spaces and frontend on Vercel.

## Prerequisites

1. **GitHub Account** - For storing your code
2. **Hugging Face Account** - For ML backend hosting (free)
3. **Vercel Account** - For frontend hosting (free)
4. **Git installed locally** - For pushing code

---

## Part 1: Push Code to GitHub

### 1.1 Initialize Git Repository (if not done)

```bash
cd /Users/sujit/Desktop/Census-System
git init
git add .
git commit -m "Initial commit - Census System with ML backend"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `census-system`
4. Make it Public
5. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/census-system.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy ML Backend to Hugging Face Spaces

### 2.1 Create Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Fill in details:
   - **Owner**: Your username
   - **Name**: `census-ml` (or similar)
   - **SDK**: Docker
   - **License**: MIT
4. Click "Create Space"

### 2.2 Connect GitHub Repository

1. In your new Space, go to "Settings" tab
2. Find "Repository" section
3. Click "Connect to GitHub"
4. Select your `census-system` repository
5. Select the `ML` directory as the Docker build context

### 2.3 Configure Space Settings

In Space settings, set:
- **Port**: 7860 (already in Dockerfile)
- **Build command**: (leave empty - Dockerfile handles it)
- **CPU**: ✓ Enabled (free tier)
- **Timeout**: 600 seconds (for OCR processing)

### 2.4 Trigger Build

1. Go to "Files" tab in your Space
2. You should see the ML folder files
3. Hugging Face will automatically start building
4. Wait for build to complete (may take 5-10 minutes first time)
5. Check "Logs" tab for progress

### 2.5 Get Your ML API URL

Once deployed, your ML API will be available at:
```
https://YOUR_USERNAME-census-ml.hf.space
```

Test it:
```bash
curl -X POST -F "file=@test.jpg" https://YOUR_USERNAME-census-ml.hf.space/extract
```

---

## Part 3: Deploy Frontend to Vercel

### 3.1 Prepare Environment Variables

Edit `.env.production` and update with your actual values:

```env
# Supabase (get from your Supabase dashboard)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# ML API URL (from Hugging Face Spaces)
VITE_ML_API_URL=https://YOUR_USERNAME-census-ml.hf.space/extract
```

### 3.2 Push Updated Code

```bash
git add .
git commit -m "Add production environment config"
git push
```

### 3.3 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository `census-system`
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.4 Add Environment Variables

In Vercel project settings, add these variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key |
| `VITE_ML_API_URL` | `https://YOUR_USERNAME-census-ml.hf.space/extract` |

### 3.5 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Get your frontend URL: `https://census-system.vercel.app`

---

## Part 4: Update CORS Configuration

After getting your Vercel frontend URL, update `ML/app.py`:

```python
CORS(app, resources={
    r"/extract": {
        "origins": [
            "http://localhost:5173",
            "https://census-system.vercel.app",  # Your Vercel URL
        ]
    }
})
```

Push the change to rebuild the ML Space.

---

## Part 5: Test the Complete Flow

### 5.1 Test ML Endpoint Directly

```bash
# Replace with your actual ML URL
curl -X POST -F "file=@test_aadhar.jpg" https://YOUR_HF_SPACE_URL/extract
```

Expected response:
```json
{
  "Name": "John Doe",
  "Aadhaar Number": "1234 5678 9012",
  "is_valid_ocr": true
}
```

### 5.2 Test Frontend

1. Open your Vercel URL: `https://census-system.vercel.app`
2. Go through the census form
3. Upload an Aadhar image
4. Complete Step 2 (Aadhar Verification)
5. Verify no console errors in browser DevTools

---

## Part 6: Troubleshooting

### ML Space Issues

| Problem | Solution |
|---------|----------|
| Build fails | Check logs in HF Space settings |
| Timeout on OCR | Increase timeout in Gunicorn command |
| CORS error | Update CORS origins in `app.py` |
| 502 Bad Gateway | Check if server is running (Logs tab) |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| ML API not connecting | Verify VITE_ML_API_URL in Vercel env vars |
| Supabase connection failed | Check Supabase keys in env vars |
| Build fails | Check Vercel build logs |
| Route 404 on refresh | Ensure vercel.json has rewrites |

### Common Commands

```bash
# Test ML locally
cd ML
pip install -r requirements.txt
python app.py

# Test ML with Gunicorn (production-like)
cd ML
gunicorn --bind 0.0.0.0:7860 --timeout 120 app:app

# Build frontend
npm run build

# Preview frontend locally
npm run preview
```

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://census-system.vercel.app` |
| ML API (Hugging Face) | `https://username-census-ml.hf.space/extract` |
| Supabase | `https://your-project.supabase.co` |

---

## Security Checklist

- [ ] Set proper CORS origins (not `*` in production)
- [ ] Use Supabase Row Level Security (RLS)
- [ ] Don't expose sensitive keys in frontend code
- [ ] Enable HTTPS on all endpoints
- [ ] Set up rate limiting on ML API (optional)

---

## Maintenance

### Update ML Backend
1. Make changes in ML folder
2. Push to GitHub
3. Hugging Face auto-rebuilds

### Update Frontend
1. Make code changes
2. Push to GitHub
3. Vercel auto-deploys

### Monitor Usage
- Check Hugging Face Space logs regularly
- Monitor Vercel analytics
- Check Supabase for database usage

