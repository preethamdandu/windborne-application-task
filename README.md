# WindBorne Balloon Tracker

Interactive web application that visualizes real-time weather balloon data from WindBorne Systems, combined with atmospheric weather data from Open-Meteo API.

## Overview

This application fetches the last 24 hours of weather balloon flight data from WindBorne's constellation API and combines it with ground-level weather data from Open-Meteo to provide comprehensive atmospheric insights through interactive visualizations.

**Live Application:** https://windborne-application-task.vercel.app

## Features

- **Real-time Data**: Fetches the latest 24 hours of balloon flight data from WindBorne's API
- **Weather Integration**: Combines balloon data with ground-level weather conditions from Open-Meteo
- **Interactive Map**: Visualizes balloon trajectories on an interactive world map
- **Data Visualization**: Charts showing altitude over time and combined balloon altitude vs ground temperature
- **Robust Error Handling**: Gracefully handles corrupted or missing data files
- **Auto-updates**: Refreshes data automatically every hour
- **CORS Proxy**: Serverless function to bypass CORS restrictions

## Implementation

### Data Fetching

The application fetches the last 24 hours of balloon data by querying WindBorne's API endpoints (`00.json` through `23.json`). The implementation:

- Calculates the current UTC hour and fetches data for the previous 24 hours
- Uses `Promise.allSettled()` to handle individual hour failures gracefully
- Routes all API requests through a Vercel serverless function proxy (`/api/windborne`) to avoid CORS issues
- Implements robust data parsing to handle varying JSON structures (arrays, nested objects, different field names)
- Validates each data point to ensure it contains required latitude/longitude coordinates
- Extracts values using flexible field name matching (`lat`/`latitude`, `lon`/`longitude`, `alt`/`altitude`/`height`, etc.)

### Weather Data Integration

Open-Meteo API is integrated to provide ground-level weather context:

- Extracts unique balloon locations and samples up to 10 representative points
- Fetches current temperature, humidity, and wind speed for each location
- Combines weather data with balloon measurements to provide atmospheric insights
- Matches weather data with balloon locations for combined visualizations

### Visualizations

**Interactive Map (Leaflet.js)**
- Plots balloon positions as circle markers (sampled for performance)
- Centers map on the geographic center of all data points
- Displays altitude and hour information in popups
- Auto-fits bounds to show all balloon locations

**Charts (Chart.js)**
- **Altitude Over Time**: Line chart showing altitude progression across the 24-hour period
- **Combined Data Visualization**: Scatter plot showing balloon altitude vs ground temperature (combining both datasets)

**Data Table**
- Displays the 20 most recent data points with coordinates, altitude, temperature, and wind speed
- Enriches data with weather API information when available

### Error Handling

The application handles various failure scenarios:

- Missing or corrupted API responses (returns empty arrays)
- Invalid data structures (attempts multiple parsing strategies)
- Network failures (uses `Promise.allSettled` to continue with available data)
- Missing fields (validates before processing, uses fallback field names)
- CORS issues (routes through serverless proxy)

### Auto-Refresh

Data automatically refreshes every hour using `setInterval()` to maintain current information.

## Technology Stack

- **Vanilla JavaScript (ES6+)**: No build tools or frameworks required
- **Leaflet.js**: Interactive mapping library
- **Chart.js**: Data visualization charts
- **Open-Meteo API**: Free weather data API (no API key required)
- **Vercel Serverless Functions**: CORS proxy for WindBorne API
- **CSS3**: Modern styling with gradients and responsive design

## Project Structure

```
.
├── index.html              # Main application page
├── styles.css              # Styling
├── script.js               # Main application logic
├── api/
│   └── windborne.js        # Serverless function proxy for CORS
├── submit-application.html # Browser-based submission form
├── submit-application.js   # Node.js submission script
├── package.json            # Project metadata
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## Deployment

### Vercel (Recommended)

1. **Push repository to GitHub**
2. **Go to [vercel.com](https://vercel.com)** and sign in
3. **Click "Add New..." → "Project"**
4. **Import your GitHub repository**
5. **Leave all settings as default** (no build command needed)
6. **Click "Deploy"**
7. **Your app will be live at**: `https://your-project.vercel.app`

**Via CLI:**
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify

1. Push repository to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Leave build command empty, set publish directory to `.`

### GitHub Pages

1. Push repository to GitHub
2. Go to Settings > Pages
3. Select source branch and deploy

## Local Development

```bash
npm install
npm start
```

Or use any static file server. Note: CORS restrictions may prevent API calls when opening `index.html` directly via `file://` protocol.

For full parity with the production proxy, install the Vercel CLI and run:

```bash
vercel dev
```

This spins up the same `/api/windborne` serverless function locally.

## API Endpoints

- **WindBorne**: `https://a.windbornesystems.com/treasure/{00-23}.json`
- **Open-Meteo**: `https://api.open-meteo.com/v1/forecast`
- **Proxy**: `/api/windborne?hour={00-23}` (Vercel serverless function)

## Application Submission

The application has been submitted to WindBorne Systems. Use `submit-application.html` (browser form) or `submit-application.js` (Node.js script) to submit applications. Ensure all fields are filled and the payload is wrapped in a `career_application` object as required by the API.

**Submission Format:**
```json
{
  "career_application": {
    "name": "Your name",
    "email": "Your email",
    "role": "Junior Web Developer",
    "notes": "Your specialization + collaboration sentence + API choice explanation",
    "submission_url": "Your deployed challenge URL",
    "portfolio_url": "Your portfolio project URL",
    "resume_url": "Your resume link"
  }
}
```

## Troubleshooting

**CORS Errors**: The app uses a serverless proxy when deployed on Vercel. If testing locally, use `vercel dev` to run the proxy locally.

**API Errors**: The app handles missing/corrupted data gracefully. Some hours may not have data, which is expected.

**Map Not Rendering**: Ensure Leaflet.js CDN is loading. Check browser console for errors.

**Charts Empty**: Verify Chart.js CDN is loading and data is being fetched successfully.

**Deployment Issues**: Make sure all files are committed and pushed to your repository before deploying.

## License

MIT
