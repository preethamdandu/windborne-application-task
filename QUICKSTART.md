# Quick Start Guide

## What's Been Built

✅ **Complete Web Application** that:
- Fetches the last 24 hours of WindBorne balloon data (00.json through 23.json)
- Combines it with Open-Meteo weather API data
- Displays interactive visualizations (map, charts, data table)
- Handles errors and corrupted data gracefully
- Auto-updates every hour

## Next Steps

### 1. Deploy Your Application

Choose one of these options:

**Vercel (Easiest):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the web interface at [vercel.com](https://vercel.com)

**Netlify:**
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Connect your repository
- Deploy (no build settings needed)

**GitHub Pages:**
- Push to GitHub
- Go to Settings > Pages
- Select source branch and deploy

### 2. Prepare Your Application Materials

- **Portfolio URL**: Choose your best project and make sure it's publicly hosted
- **Resume URL**: Upload to Google Drive and set sharing to "anyone with link can view"
- **Coding Challenge URL**: This will be your deployed app URL

### 3. Submit Your Application

**Option A: Use the HTML form** (Easiest)
- Open `submit-application.html` in your browser
- Fill in all fields
- Click "Submit Application"

**Option B: Use the Node.js script**
- Edit `submit-application.js` with your details
- Run: `node submit-application.js`

**Option C: Use curl or Postman**
```bash
curl -X POST https://windbornesystems.com/career_applications.json \
  -H "Content-Type: application/json" \
  -d '{
    "career_application": {
      "name": "Your Name",
      "email": "your@email.com",
      "role": "Junior Web Developer",
      "notes": "Your notes here...",
      "submission_url": "https://your-app.vercel.app",
      "portfolio_url": "https://your-portfolio.com",
      "resume_url": "https://drive.google.com/..."
    }
  }'
```

### 4. Verify Submission

Make sure you get a `200` status code response. If successful, you should receive confirmation.

## Application Fields Explained

- **name**: Your full name
- **email**: Your email address
- **role**: "Junior Web Developer" (fixed)
- **notes**: Should include:
  - One sentence about your collaboration/specialization
  - One sentence explaining why you chose your external dataset/API
- **submission_url**: Your deployed coding challenge URL
- **portfolio_url**: Your best portfolio project URL
- **resume_url**: Google Drive link to your resume

## Notes Template

Here's a template for your notes field:

```
I'm a [collaboration/specialization sentence]. I chose the [API/dataset name] to combine with WindBorne's balloon data because [reason for choosing it].
```

Example (already in the code):
```
I'm a collaborative developer who thrives in team environments, bringing strong communication skills and a passion for building user-focused solutions. I chose the Open-Meteo weather API to combine with WindBorne's balloon data because it provides complementary atmospheric data that helps contextualize the high-altitude measurements, revealing interesting relationships between ground-level weather conditions and balloon trajectories.
```

## Troubleshooting

**CORS Errors**: The app should work fine when deployed. If testing locally, use a local server:
```bash
npx serve .
```

**API Errors**: The app handles missing/corrupted data gracefully. Some hours may not have data, which is expected.

**Deployment Issues**: Make sure all files are committed and pushed to your repository before deploying.

## Project Structure

```
.
├── index.html              # Main application page
├── styles.css              # Styling
├── script.js               # Main application logic
├── submit-application.html # Browser-based submission form
├── submit-application.js   # Node.js submission script
├── package.json            # Project metadata
├── vercel.json             # Vercel deployment config
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Detailed deployment guide
└── QUICKSTART.md           # This file
```

Good luck with your application! 🚀

