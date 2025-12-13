// This script creates a .env.local file with the required environment variables
const fs = require('fs');
const path = require('path');

// Define the environment variables
const envVars = {
  VITE_API_BASE_URL: 'http://localhost:8000/api/v1',
  VITE_API_URL: 'http://localhost:8000',
  VITE_FIREBASE_API_KEY: 'your_api_key_here',
  VITE_FIREBASE_AUTH_DOMAIN: 'your_project_id.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'your_project_id',
  VITE_FIREBASE_STORAGE_BUCKET: 'your_project_id.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'your_messaging_sender_id',
  VITE_FIREBASE_APP_ID: 'your_app_id',
  VITE_ENABLE_ANALYTICS: 'true',
  VITE_ENABLE_NOTIFICATIONS: 'true',
  VITE_ENABLE_PAYMENTS: 'true',
  VITE_SITE_NAME: 'CareerOpen',
  VITE_SITE_DESCRIPTION: 'Professional Job Board Platform',
  VITE_SITE_URL: 'https://careeropen.com'
};

// Create the .env.local file content
let envContent = '# API Configuration\n';
Object.entries(envVars).forEach(([key, value]) => {
  envContent += `${key}=${value}\n`;
});

// Write the file
const envPath = path.join(__dirname, '.env.local');
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('Successfully created .env.local file with the following configuration:');
console.log(envContent);
console.log('\nPlease restart your development server for the changes to take effect.');
