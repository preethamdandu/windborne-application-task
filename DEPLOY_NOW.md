# Quick Deploy to Vercel - Follow These Steps

## 🚀 Fastest Method (5 minutes)

### Step 1: Initialize Git Repository

Open Terminal and run these commands:

```bash
cd "/Users/preethamdandu/Desktop/small task"
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `windborne-balloon-tracker` (or any name you like)
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** check "Initialize with README" (you already have files)
6. Click **"Create repository"**

### Step 3: Push to GitHub

Copy the commands GitHub shows you, or run these (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/windborne-balloon-tracker.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"** (you can use GitHub to sign in)
3. Click **"Add New..."** → **"Project"**
4. Click **"Import Git Repository"**
5. Find and select your `windborne-balloon-tracker` repository
6. Click **"Import"**
7. **Leave all settings as default** (no build command needed)
8. Click **"Deploy"**
9. Wait 1-2 minutes

### Step 5: Get Your URL

After deployment completes, you'll see:
- ✅ **Your live URL:** `https://windborne-balloon-tracker.vercel.app` (or similar)
- **Copy this URL** - this is your `submission_url`!

---

## 🎯 Alternative: Deploy via CLI (If you prefer command line)

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### Deploy:
```bash
cd "/Users/preethamdandu/Desktop/small task"
vercel
```

Follow the prompts. When asked:
- Set up and deploy? → **Yes**
- Link to existing project? → **No**
- Project name? → Press Enter (or type a name)
- Directory? → Press Enter (use `./`)

### For production:
```bash
vercel --prod
```

---

## ✅ After Deployment

1. **Test your app:** Visit your Vercel URL and make sure it works
2. **Update submission:** Open `submit-application.html` and replace `YOUR_CHALLENGE_URL` with your Vercel URL
3. **Submit application:** Use the submission form with your Vercel URL

---

## 📝 Your Deployment URL

After successful deployment, your URL will look like:
- `https://windborne-balloon-tracker.vercel.app`
- Or: `https://windborne-balloon-tracker-[random].vercel.app`

**Save this URL!** You'll need it for your application submission.

