// WindBorne Balloon Tracker - Main Application Logic

const WINDBORNE_BASE_URL = 'https://a.windbornesystems.com/treasure/';
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';

let map;
let altitudeChart;
let tempChart;
let allBalloonData = [];
let weatherData = [];

// Initialize the application
async function init() {
    try {
        showLoading();
        await loadBalloonData();
        await loadWeatherData();
        
        // Only render if we have data
        console.log(`Total data points loaded: ${allBalloonData.length}`);
        if (allBalloonData.length > 0) {
            console.log('Sample data point:', allBalloonData[0]);
            renderVisualizations();
            updateStats();
            generateInsights();
            hideLoading();
        } else {
            // Show error if no data loaded
            console.error('No data loaded from API. Check console for details.');
            document.getElementById('error').innerHTML = '<p>⚠️ Unable to load balloon data. The API may be temporarily unavailable or the data format has changed. Please check the browser console (F12) for details.</p>';
            showError();
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        document.getElementById('error').innerHTML = `<p>⚠️ Error loading data: ${error.message}. Please check the browser console for details.</p>`;
        showError();
    }
}

// Fetch balloon data from the last 24 hours
async function loadBalloonData() {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const promises = [];
    
    // Fetch data for the last 24 hours
    for (let i = 0; i < 24; i++) {
        const hour = (currentHour - i + 24) % 24;
        const hourStr = hour.toString().padStart(2, '0');
        promises.push(fetchBalloonData(hourStr, i));
    }
    
    const results = await Promise.allSettled(promises);
    allBalloonData = [];
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
            const hour = (currentHour - index + 24) % 24;
            result.value.forEach(point => {
                if (isValidDataPoint(point)) {
                    allBalloonData.push({
                        ...point,
                        hour: hour,
                        timestamp: new Date(Date.now() - index * 3600000)
                    });
                }
            });
        }
    });
    
    console.log(`Loaded ${allBalloonData.length} valid data points from ${results.filter(r => r.status === 'fulfilled').length} hours`);
}

// Fetch data for a specific hour with error handling
async function fetchBalloonData(hourStr, hourOffset) {
    try {
        const url = `${WINDBORNE_BASE_URL}${hourStr}.json`;
        const response = await fetch(url, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Log the data structure for debugging
        console.log(`Hour ${hourStr} data structure:`, typeof data, Array.isArray(data) ? 'Array' : Object.keys(data));
        
        let rawData = [];
        
        // Handle different data structures
        if (Array.isArray(data)) {
            console.log(`Hour ${hourStr}: Found array with ${data.length} items`);
            rawData = data;
        } else if (data.data && Array.isArray(data.data)) {
            console.log(`Hour ${hourStr}: Found data.data array with ${data.data.length} items`);
            rawData = data.data;
        } else if (data.balloons && Array.isArray(data.balloons)) {
            console.log(`Hour ${hourStr}: Found balloons array with ${data.balloons.length} items`);
            rawData = data.balloons;
        } else if (typeof data === 'object') {
            // Try to extract arrays from object
            const keys = Object.keys(data);
            for (const key of keys) {
                if (Array.isArray(data[key])) {
                    console.log(`Hour ${hourStr}: Found array in key '${key}' with ${data[key].length} items`);
                    rawData = data[key];
                    break;
                }
            }
        }
        
        // Convert array format [lon, lat, alt] to object format
        if (rawData.length > 0 && Array.isArray(rawData[0])) {
            console.log(`Hour ${hourStr}: Converting array format to objects, found ${rawData.length} items`);
            return rawData.map((item, index) => {
                // Handle array format: [longitude, latitude, altitude]
                if (Array.isArray(item) && item.length >= 2) {
                    const val1 = item[0];
                    const val2 = item[1];
                    const val3 = item[2] || null;
                    
                    // Standard geospatial format is [longitude, latitude, altitude]
                    // Longitude: -180 to 180, Latitude: -90 to 90
                    // If first value is outside lat range, it's definitely longitude
                    // Otherwise, assume standard [lon, lat, alt] format (common in GeoJSON, etc.)
                    let lon, lat;
                    
                    if (Math.abs(val1) > 90 || Math.abs(val1) > 180) {
                        // First value is clearly longitude (outside lat range or > 180)
                        lon = val1;
                        lat = val2;
                    } else if (Math.abs(val2) > 90) {
                        // Second value is outside lat range, so format is [lat, lon]
                        lat = val1;
                        lon = val2;
                    } else {
                        // Both are in valid ranges, assume standard [lon, lat] format
                        // (This is the most common format in geospatial data)
                        lon = val1;
                        lat = val2;
                    }
                    
                    return {
                        lon: lon,
                        lat: lat,
                        alt: val3,
                        longitude: lon,
                        latitude: lat,
                        altitude: val3
                    };
                }
                return item; // Return as-is if not array format
            });
        }
        
        return rawData;
    } catch (error) {
        console.warn(`Failed to fetch hour ${hourStr}:`, error.message);
        return null;
    }
}

// Validate data point structure
function isValidDataPoint(point) {
    if (!point || typeof point !== 'object') return false;
    
    // Check for required fields (latitude, longitude)
    const hasLat = (point.lat !== undefined && point.lat !== null) || 
                   (point.latitude !== undefined && point.latitude !== null);
    const hasLon = (point.lon !== undefined && point.lon !== null) || 
                   (point.longitude !== undefined && point.longitude !== null);
    
    return hasLat && hasLon;
}

// Extract numeric value from various field names
function extractValue(point, ...fieldNames) {
    for (const field of fieldNames) {
        if (point[field] !== undefined && point[field] !== null) {
            const val = parseFloat(point[field]);
            if (!isNaN(val)) return val;
        }
    }
    return null;
}

// Load weather data for balloon locations
async function loadWeatherData() {
    if (allBalloonData.length === 0) return;
    
    // Get unique locations
    const locations = new Map();
    allBalloonData.forEach(point => {
        const lat = extractValue(point, 'lat', 'latitude');
        const lon = extractValue(point, 'lon', 'longitude');
        if (lat !== null && lon !== null) {
            const key = `${lat.toFixed(1)},${lon.toFixed(1)}`;
            if (!locations.has(key)) {
                locations.set(key, { lat, lon });
            }
        }
    });
    
    // Fetch weather for sample locations (limit to avoid too many API calls)
    const locationArray = Array.from(locations.values()).slice(0, 10);
    const weatherPromises = locationArray.map(loc => 
        fetchWeatherForLocation(loc.lat, loc.lon)
    );
    
    const results = await Promise.allSettled(weatherPromises);
    weatherData = results
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherForLocation(lat, lon) {
    try {
        const url = `${WEATHER_API_BASE}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=UTC`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return {
            lat,
            lon,
            temperature: data.hourly?.temperature_2m?.[0] || null,
            humidity: data.hourly?.relativehumidity_2m?.[0] || null,
            windSpeed: data.hourly?.windspeed_10m?.[0] || null
        };
    } catch (error) {
        console.warn(`Failed to fetch weather for ${lat},${lon}:`, error.message);
        return null;
    }
}

// Initialize map
function initMap() {
    if (allBalloonData.length === 0) return;
    
    // Remove existing map if it exists
    if (map) {
        map.remove();
        map = null;
    }
    
    // Calculate center from data
    const lats = allBalloonData.map(p => extractValue(p, 'lat', 'latitude')).filter(v => v !== null);
    const lons = allBalloonData.map(p => extractValue(p, 'lon', 'longitude')).filter(v => v !== null);
    
    if (lats.length === 0 || lons.length === 0) return;
    
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length;
    
    map = L.map('map').setView([centerLat, centerLon], 3);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for balloon positions
    allBalloonData.forEach((point, index) => {
        const lat = extractValue(point, 'lat', 'latitude');
        const lon = extractValue(point, 'lon', 'longitude');
        const alt = extractValue(point, 'alt', 'altitude', 'height');
        
        if (lat !== null && lon !== null) {
            const popup = `
                <strong>Balloon Data Point</strong><br>
                Altitude: ${alt !== null ? alt.toFixed(0) + 'm' : 'N/A'}<br>
                Hour: ${point.hour || 'N/A'}
            `;
            
            L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: '#667eea',
                color: '#fff',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6
            }).bindPopup(popup).addTo(map);
        }
    });
}

// Initialize charts
function initCharts() {
    // Destroy existing charts if they exist
    if (altitudeChart) {
        altitudeChart.destroy();
        altitudeChart = null;
    }
    if (tempChart) {
        tempChart.destroy();
        tempChart = null;
    }
    
    // Prepare data for altitude chart
    const timeLabels = [];
    const altitudeData = [];
    const sortedData = [...allBalloonData].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    sortedData.forEach(point => {
        const alt = extractValue(point, 'alt', 'altitude', 'height');
        if (alt !== null) {
            timeLabels.push(point.hour !== undefined ? `Hour ${point.hour}` : '');
            altitudeData.push(alt);
        }
    });
    
    // Altitude chart
    const altitudeCtx = document.getElementById('altitudeChart').getContext('2d');
    altitudeChart = new Chart(altitudeCtx, {
        type: 'line',
        data: {
            labels: timeLabels.slice(0, 50), // Limit to 50 points for performance
            datasets: [{
                label: 'Altitude (meters)',
                data: altitudeData.slice(0, 50),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Altitude (m)'
                    }
                }
            }
        }
    });
    
    // Temperature vs Altitude chart
    const tempData = [];
    const altData = [];
    
    allBalloonData.forEach(point => {
        const alt = extractValue(point, 'alt', 'altitude', 'height');
        const temp = extractValue(point, 'temp', 'temperature');
        
        if (alt !== null && temp !== null) {
            altData.push(alt);
            tempData.push(temp);
        }
    });
    
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(tempCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Temperature vs Altitude',
                data: altData.map((alt, i) => ({ x: alt, y: tempData[i] })),
                backgroundColor: 'rgba(118, 75, 162, 0.6)',
                borderColor: '#764ba2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Altitude (m)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

// Update statistics
function updateStats() {
    const uniqueBalloons = new Set();
    const altitudes = [];
    
    allBalloonData.forEach(point => {
        // Try to identify unique balloons (if ID exists)
        const id = point.id || point.balloon_id || point.device_id;
        if (id) uniqueBalloons.add(id);
        
        const alt = extractValue(point, 'alt', 'altitude', 'height');
        if (alt !== null) altitudes.push(alt);
    });
    
    const activeBalloons = uniqueBalloons.size || allBalloonData.length;
    const avgAltitude = altitudes.length > 0 
        ? (altitudes.reduce((a, b) => a + b, 0) / altitudes.length).toFixed(0)
        : 'N/A';
    
    document.getElementById('activeBalloons').textContent = activeBalloons;
    document.getElementById('avgAltitude').textContent = avgAltitude + (avgAltitude !== 'N/A' ? 'm' : '');
    document.getElementById('dataPoints').textContent = allBalloonData.length;
    document.getElementById('hoursAnalyzed').textContent = '24';
    
    // Update last update time
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
}

// Generate insights
function generateInsights() {
    const insights = [];
    
    // Calculate statistics
    const altitudes = allBalloonData.map(p => extractValue(p, 'alt', 'altitude', 'height')).filter(v => v !== null);
    const temps = allBalloonData.map(p => extractValue(p, 'temp', 'temperature')).filter(v => v !== null);
    
    if (altitudes.length > 0) {
        const maxAlt = Math.max(...altitudes);
        const minAlt = Math.min(...altitudes);
        insights.push({
            title: 'Altitude Range',
            text: `Balloons reached altitudes between ${minAlt.toFixed(0)}m and ${maxAlt.toFixed(0)}m`
        });
    }
    
    if (temps.length > 0) {
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        insights.push({
            title: 'Average Temperature',
            text: `Mean temperature recorded: ${avgTemp.toFixed(1)}°C`
        });
    }
    
    if (allBalloonData.length > 0) {
        const dataRate = (allBalloonData.length / 24).toFixed(1);
        insights.push({
            title: 'Data Collection Rate',
            text: `Average of ${dataRate} data points per hour collected`
        });
    }
    
    if (weatherData.length > 0) {
        const avgWeatherTemp = weatherData
            .map(w => w.temperature)
            .filter(t => t !== null)
            .reduce((a, b) => a + b, 0) / weatherData.length;
        insights.push({
            title: 'Ground Weather',
            text: `Average ground temperature: ${avgWeatherTemp.toFixed(1)}°C (from ${weatherData.length} locations)`
        });
    }
    
    // Render insights
    const insightsContainer = document.getElementById('insights');
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <strong>${insight.title}</strong>
            <div>${insight.text}</div>
        </div>
    `).join('');
}

// Render data table
function renderDataTable() {
    const tbody = document.getElementById('tableBody');
    const recentData = allBalloonData.slice(-20).reverse(); // Last 20 points
    
    tbody.innerHTML = recentData.map(point => {
        const lat = extractValue(point, 'lat', 'latitude');
        const lon = extractValue(point, 'lon', 'longitude');
        const alt = extractValue(point, 'alt', 'altitude', 'height');
        const temp = extractValue(point, 'temp', 'temperature');
        const wind = extractValue(point, 'wind', 'wind_speed', 'windspeed');
        const time = point.timestamp ? point.timestamp.toLocaleTimeString() : `Hour ${point.hour || 'N/A'}`;
        
        return `
            <tr>
                <td>${time}</td>
                <td>${lat !== null ? lat.toFixed(4) : 'N/A'}</td>
                <td>${lon !== null ? lon.toFixed(4) : 'N/A'}</td>
                <td>${alt !== null ? alt.toFixed(0) : 'N/A'}</td>
                <td>${temp !== null ? temp.toFixed(1) : 'N/A'}</td>
                <td>${wind !== null ? wind.toFixed(1) : 'N/A'}</td>
            </tr>
        `;
    }).join('');
}

// Render all visualizations
function renderVisualizations() {
    initMap();
    initCharts();
    renderDataTable();
}

// UI Helper functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    document.getElementById('error').style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Auto-refresh every hour
setInterval(init, 3600000);

