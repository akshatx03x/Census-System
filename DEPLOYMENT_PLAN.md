# Deployment Plan for Census System

## Overview
Deploy ML backend to Hugging Face Spaces and Frontend to Vercel for public access.

## Architecture
```
User → Vercel (Frontend) → Hugging Face Spaces (ML Backend) → Supabase (Database)
```

## Step 1: ML Backend Deployment (Hugging Face Spaces)

### Required Changes:
- [ ] Update `app.py` for Hugging Face Spaces compatibility
- [ ] Ensure `Dockerfile` is optimized (already done)
- [ ] Create `README.md` for Hugging Face Spaces
- [ ] Test locally with Gunicorn

### Hugging Face Spaces Settings:
- **Space SDK**: Docker
- **Port**: 7860 (already configured)
- **Hardware**: CPU (free tier) - sufficient for inference
- **Timeout**: 600 seconds (for OCR processing)

## Step 2: Frontend Deployment (Vercel)

### Required Changes:
- [ ] Create `.env.production` with `VITE_ML_API_URL`
- [ ] Update `vite.config.ts` to remove local proxy
- [ ] Update `Census.tsx` to use production ML URL
- [ ] Create `vercel.json` for routing

### Vercel Settings:
- **Framework**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_SUPABASE_URL` (already exists)
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (already exists)
  - `VITE_ML_API_URL` = `https://your-hf-space.hf.space/extract`

## Step 3: CORS Configuration

### In ML Backend (`app.py`):
- Allow all origins for production OR specific Vercel domain
- Example: `CORS(app, resources={r"/extract": {"origins": "https://your-project.vercel.app"}}`

## Step 4: Deployment Sequence

### 4.1 Deploy ML Backend First
1. Push ML folder to GitHub
2. Create new Space on Hugging Face
3. Connect GitHub repository
4. Get public URL (e.g., `https://username-census-ml.hf.space`)

### 4.2 Deploy Frontend
1. Update `.env` with ML API URL
2. Push to GitHub
3. Import project in Vercel
4. Add environment variables
5. Deploy

## Step 5: Testing
- [ ] Test ML endpoint directly: `https://your-hf-space.hf.space`
- [ ] Test frontend: `https://your-vercel-app.vercel.app`
- [ ] Test complete flow: Upload Aadhar → ML verification → Submit

## File Changes Summary

### Files to Create:
- `ML/README.md` - Hugging Face Spaces documentation
- `.env.production` - Production environment variables
- `vercel.json` - Vercel configuration

### Files to Modify:
- `ML/app.py` - Add CORS for production
- `src/pages/Census.tsx` - Update ML API URL
- `vite.config.ts` - Remove local proxy for production

## Post-Deployment Checklist
- [ ] Update ML API URL in Vercel environment variables
- [ ] Test Aadhar verification flow
- [ ] Monitor Hugging Face Spaces logs for errors
- [ ] Set up custom domain if needed

## Troubleshooting
- If ML timeout: Increase timeout in Gunicorn config
- If CORS error: Verify CORS origins in `app.py`
- If 502 error: Check Hugging Face Spaces logs

