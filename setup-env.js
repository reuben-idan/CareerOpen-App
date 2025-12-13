const fs = require('fs');
const path = require('path');

const envContent = `# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_URL=http://localhost:8000

# Firebase Configuration (if needed)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PAYMENTS=true

# SEO
VITE_SITE_NAME=CareerOpen
VITE_SITE_DESCRIPTION=Professional Job Board Platform
VITE_SITE_URL=https://careeropen.com`;

// Create .env file in the project root
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('Successfully created .env file with default configuration.');
console.log('Please restart your development server for the changes to take effect.');
