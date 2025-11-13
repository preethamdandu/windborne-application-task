# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   Or simply:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy (no build settings needed)

3. **Your app will be live at**: `https://your-project.vercel.app`

### Option 2: Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```
   Or use the web interface:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Build settings: Leave empty (no build needed)
   - Publish directory: `.` (or leave empty)

3. **Your app will be live at**: `https://your-project.netlify.app`

### Option 3: GitHub Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to Pages
   - Select source branch (usually `main`)
   - Select folder: `/ (root)`
   - Save

3. **Your app will be live at**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## After Deployment

1. **Test your live URL** to ensure it works
2. **Update `submit-application.js`** with your deployment URL
3. **Submit your application** using the helper script

## Notes

- All hosting options above support static sites (no server needed)
- The app uses client-side JavaScript, so no backend is required
- CORS is handled by the APIs (WindBorne and Open-Meteo both support CORS)

