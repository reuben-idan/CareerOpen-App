import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');

// Check if .env file already exists
if (existsSync(envPath)) {
  console.log('.env file already exists. Skipping creation.');
  process.exit(0);
}

// Create .env file with template
const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=https://your-api-url.com

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Configuration
VITE_ENABLE_ANALYTICS=false
VITE_GA_TRACKING_ID=your_ga_tracking_id
VITE_ENABLE_PAYMENTS=false
VITE_ENABLE_NOTIFICATIONS=true
`;

writeFileSync(envPath, envTemplate);
console.log('Created .env file. Please update it with your actual configuration values.');
