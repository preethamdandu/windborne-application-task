# Deploy to Vercel - Step by Step Guide

## Method 1: Deploy via Vercel Web Interface (Easiest)

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   ```bash
   cd "/Users/preethamdandu/Desktop/small task"
   git init
   git add .
   git commit -m "Initial commit - WindBorne Balloon Tracker"
   ```

2. **Create repository on GitHub:**
   - Go to [github.com](https://github.com) and click "New repository"
   - Name it (e.g., `windborne-balloon-tracker`)
   - Don't initialize with README (you already have files)
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/windborne-balloon-tracker.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

### Step 2: Deploy on Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (you can use your GitHub account)

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `windborne-balloon-tracker` repository
   - Click "Import"

3. **Configure deployment:**
   - **Framework Preset:** Other (or leave as default)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty (no build needed)
   - **Output Directory:** Leave empty
   - **Install Command:** Leave empty

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment to complete

5. **Get your URL:**
   - Once deployed, you'll see: `https://your-project-name.vercel.app`
   - This is your **submission_url** for the application!

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```
Follow the prompts to authenticate.

### Step 3: Deploy

```bash
cd "/Users/preethamdandu/Desktop/small task"
vercel
```

**When prompted:**
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default or type a name)
- Directory? **./** (Press Enter)
- Override settings? **No**

### Step 4: Production Deployment

For production deployment (with custom domain):
```bash
vercel --prod
```

---

## After Deployment

1. **Test your deployment:**
   - Visit your Vercel URL (e.g., `https://windborne-balloon-tracker.vercel.app`)
   - Verify the app loads and fetches data correctly

2. **Update submission script:**
   - Open `submit-application.html` or `submit-application.js`
   - Replace `YOUR_CHALLENGE_URL` with your Vercel URL
   - Example: `https://windborne-balloon-tracker.vercel.app`

3. **Submit your application:**
   - Use the submission form or script with your Vercel URL

---

## Troubleshooting

**Issue: Build fails**
- Solution: Make sure `vercel.json` is in the root directory
- No build step is needed for static files

**Issue: 404 errors**
- Solution: Ensure `index.html` is in the root directory
- Vercel automatically serves `index.html` as the entry point

**Issue: API calls fail (CORS)**
- Solution: This shouldn't happen on Vercel. If it does, check browser console for specific errors

**Issue: Charts/Map not loading**
- Solution: Check browser console for CDN loading errors
- Ensure internet connection is active (CDN resources load from external sources)

---

## Quick Deploy Commands Summary

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main

# Then deploy via Vercel web interface at vercel.com
```

---

## Your Deployment URL Format

After deployment, your URL will be:
- `https://your-project-name.vercel.app`
- Or custom domain if you configure one

**Save this URL** - you'll need it for your application submission!

