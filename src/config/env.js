const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  analytics: {
    enabled: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    trackingId: import.meta.env.VITE_GA_TRACKING_ID,
  },
  features: {
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true",
    payments: import.meta.env.VITE_ENABLE_PAYMENTS === "true",
  },
  seo: {
    siteName: import.meta.env.VITE_SITE_NAME || "CareerOpen",
    siteDescription:
      import.meta.env.VITE_SITE_DESCRIPTION ||
      "Professional Job Board Platform",
    siteUrl: import.meta.env.VITE_SITE_URL || "https://careeropen.com",
  },
};

export default config;
