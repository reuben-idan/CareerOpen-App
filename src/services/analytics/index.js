import { config } from "../../config/env.js";

class Analytics {
  constructor() {
    this.initialized = false;
    this.queue = [];
    this.config = config.analytics;
  }

  async initialize() {
    if (this.initialized || !this.config.trackingId) return;

    try {
      // Load Google Analytics script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", this.config.trackingId);

      this.initialized = true;

      // Process queued events
      this.queue.forEach((event) => this.track(event.name, event.params));
      this.queue = [];
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }
  }

  track(eventName, params = {}) {
    if (!this.config.enabled) return;

    try {
      if (!this.initialized) {
        this.queue.push({ name: eventName, params });
        return;
      }

      window.gtag("event", eventName, {
        ...params,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to track event ${eventName}:`, error);
    }
  }

  // Page view tracking
  trackPageView(path, title) {
    this.track("page_view", {
      page_path: path,
      page_title: title,
    });
  }

  // User interaction tracking
  trackUserInteraction(action, category, label) {
    this.track("user_interaction", {
      action,
      category,
      label,
    });
  }

  // Error tracking
  trackError(error, context = {}) {
    this.track("error", {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  // Performance tracking
  trackPerformance(metric) {
    this.track("performance", metric);
  }

  // Job-specific tracking
  trackJobView(jobId, jobTitle) {
    this.trackUserInteraction("job_view", "jobs", jobTitle);
  }

  trackJobApply(jobId, jobTitle) {
    this.trackUserInteraction("job_apply", "jobs", jobTitle);
  }

  trackProfileView(userId) {
    this.trackUserInteraction("profile_view", "profiles", userId);
  }

  trackSearch(query) {
    this.trackUserInteraction("search", "search", query);
  }
}

export const analytics = new Analytics();
export default analytics;
