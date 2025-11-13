// Helper script to submit application to WindBorne Systems
// Usage: node submit-application.js
// Note: Requires Node.js 18+ (for native fetch) or install node-fetch: npm install node-fetch

// IMPORTANT: Fill in your details below before running this script

const applicationData = {
    name: "Preetham Dandu",
    email: "preethamdandu8@gmail.com",
    role: "Junior Web Developer",
    notes: "As a software engineer with experience building production-grade real-time systems and ETL pipelines, I excel at collaborating across research and industry teams to deliver robust, scalable solutions that handle complex data challenges. I chose the Open-Meteo weather API to combine with WindBorne's balloon data because it provides reliable, real-time atmospheric measurements that enable meaningful analysis of how ground-level weather conditions correlate with high-altitude balloon trajectories, creating a comprehensive view of atmospheric dynamics that demonstrates the practical value of combining diverse data sources.",
    submission_url: "https://windborne-application-task.vercel.app",
    portfolio_url: "https://preethamdandu.github.io/portfolio/",
    resume_url: "https://drive.google.com/file/d/1dVdSpnYaIG-V0N0HqOVdTZJtyegRRvVX/view?usp=sharing"
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

