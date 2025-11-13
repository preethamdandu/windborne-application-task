// Helper script to submit application to WindBorne Systems
// Usage: node submit-application.js
// Note: Requires Node.js 18+ (for native fetch) or install node-fetch: npm install node-fetch

// IMPORTANT: Fill in your details below before running this script

const applicationData = {
    name: "YOUR_NAME",  // Replace with your name
    email: "YOUR_EMAIL@example.com",  // Replace with your email
    role: "Junior Web Developer",
    notes: "I'm a collaborative developer who thrives in team environments, bringing strong communication skills and a passion for building user-focused solutions. I chose the Open-Meteo weather API to combine with WindBorne's balloon data because it provides complementary atmospheric data that helps contextualize the high-altitude measurements, revealing interesting relationships between ground-level weather conditions and balloon trajectories.",
    submission_url: "YOUR_CHALLENGE_URL",  // Replace with your hosted challenge URL (e.g., https://your-app.vercel.app)
    portfolio_url: "YOUR_PORTFOLIO_URL",  // Replace with your portfolio project URL
    resume_url: "YOUR_RESUME_URL"  // Replace with your Google Drive resume link (set to "anyone with link can view")
};

async function submitApplication() {
    const url = 'https://windbornesystems.com/career_applications.json';
    
    // Wrap data in career_application object as required by the API
    const payload = {
        career_application: applicationData
    };
    
    try {
        console.log('Submitting application...');
        console.log('Data:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        
        if (response.ok && response.status === 200) {
            console.log('✅ Application submitted successfully!');
            console.log('Response:', responseData);
        } else {
            console.error('❌ Application submission failed');
            console.error('Status:', response.status);
            console.error('Response:', responseData);
        }
    } catch (error) {
        console.error('❌ Error submitting application:', error.message);
    }
}

// Check if all required fields are filled
const requiredFields = ['name', 'email', 'submission_url', 'portfolio_url', 'resume_url'];
const missingFields = requiredFields.filter(field => 
    applicationData[field] === undefined || 
    applicationData[field].startsWith('YOUR_') || 
    applicationData[field] === ''
);

if (missingFields.length > 0) {
    console.error('❌ Please fill in all required fields:');
    missingFields.forEach(field => console.error(`  - ${field}`));
    console.error('\nEdit this file and update the applicationData object with your information.');
    process.exit(1);
}

submitApplication();

