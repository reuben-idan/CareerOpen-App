// Environment configuration with fallbacks
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id",
  },
  analytics: {
    enabled: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    trackingId: import.meta.env.VITE_GA_TRACKING_ID,
  },
  features: {
    enablePayments: import.meta.env.VITE_ENABLE_PAYMENTS === "true",
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== "false",
  },
  seo: {
    siteName: import.meta.env.VITE_SITE_NAME || "CareerOpen",
    siteDescription:
      import.meta.env.VITE_SITE_DESCRIPTION ||
      "Professional Job Board Platform",
    siteUrl: import.meta.env.VITE_SITE_URL || "https://careeropen.com",
  },
};

// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Check if we're in production mode
export const isProduction = import.meta.env.PROD;

// Validate configuration
export const validateConfig = () => {
  const requiredFields = [
    "apiKey",
    "authDomain", 
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId"
  ];

  const missingFields = requiredFields.filter(field => 
    !config.firebase[field] || config.firebase[field].startsWith("placeholder")
  );

  if (missingFields.length > 0 && isProduction) {
    console.error("Missing Firebase configuration:", missingFields);
    throw new Error(`Missing required Firebase configuration: ${missingFields.join(", ")}`);
  }

  return true;
};
