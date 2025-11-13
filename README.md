# WindBorne Balloon Tracker

Interactive web application that visualizes real-time weather balloon data from WindBorne Systems, combined with atmospheric weather data from Open-Meteo API.

## Implementation

### Data Fetching

The application fetches the last 24 hours of balloon data by querying WindBorne's API endpoints (`00.json` through `23.json`). The implementation:

- Calculates the current UTC hour and fetches data for the previous 24 hours
- Uses `Promise.allSettled()` to handle individual hour failures gracefully
- Implements robust data parsing to handle varying JSON structures (arrays, nested objects, different field names)
- Validates each data point to ensure it contains required latitude/longitude coordinates
- Extracts values using flexible field name matching (`lat`/`latitude`, `lon`/`longitude`, `alt`/`altitude`/`height`, etc.)

### Weather Data Integration

Open-Meteo API is integrated to provide ground-level weather context:

- Extracts unique balloon locations and samples up to 10 representative points
- Fetches current temperature, humidity, and wind speed for each location
- Combines weather data with balloon measurements to provide atmospheric insights

### Visualizations

**Interactive Map (Leaflet.js)**
- Plots all valid balloon positions as circle markers
- Centers map on the geographic center of all data points
- Displays altitude and hour information in popups

**Charts (Chart.js)**
- **Altitude Over Time**: Line chart showing altitude progression across the 24-hour period
- **Temperature vs Altitude**: Scatter plot revealing relationships between atmospheric temperature and balloon altitude

**Data Table**
- Displays the 20 most recent data points with coordinates, altitude, temperature, and wind speed

### Error Handling

The application handles various failure scenarios:

- Missing or corrupted API responses (returns empty arrays)
- Invalid data structures (attempts multiple parsing strategies)
- Network failures (uses `Promise.allSettled` to continue with available data)
- Missing fields (validates before processing, uses fallback field names)

### Auto-Refresh

Data automatically refreshes every hour using `setInterval()` to maintain current information.

## Technology Stack

- **Vanilla JavaScript (ES6+)**: No build tools or frameworks required
- **Leaflet.js**: Interactive mapping library
- **Chart.js**: Data visualization charts
- **Open-Meteo API**: Free weather data API (no API key required)
- **CSS3**: Modern styling with gradients and responsive design

## Deployment

### Vercel
1. Push repository to GitHub
2. Import project in Vercel dashboard
3. Deploy (no build configuration needed)

### Netlify
1. Push repository to GitHub
2. Import project in Netlify
3. Leave build command empty, set publish directory to `.`

### GitHub Pages
1. Push repository to GitHub
2. Settings > Pages > Select source branch
3. Deploy from root directory

## Local Development

```bash
npm install
npm start
```

Or use any static file server. Note: CORS restrictions may prevent API calls when opening `index.html` directly via `file://` protocol.

## API Endpoints

- **WindBorne**: `https://a.windbornesystems.com/treasure/{00-23}.json`
- **Open-Meteo**: `https://api.open-meteo.com/v1/forecast`

## Application Submission

Use `submit-application.html` (browser form) or `submit-application.js` (Node.js script) to submit your application. Ensure all fields are filled and the payload is wrapped in a `career_application` object as required by the API.
