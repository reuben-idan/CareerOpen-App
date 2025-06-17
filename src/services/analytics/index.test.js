import { vi } from "vitest";
import { analytics } from "./index";

// Mock the config
vi.mock("../../config/env", () => ({
  default: {
    analytics: {
      enabled: true,
      trackingId: "test-id",
    },
  },
}));

describe("Analytics", () => {
  beforeEach(() => {
    // Reset analytics state
    analytics.initialized = false;
    analytics.queue = [];
    analytics.config = { enabled: true, trackingId: "test-id" };

    // Mock window.gtag
    window.gtag = vi.fn();
    window.dataLayer = [];

    // Mock document.head
    document.head.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("queues events if not initialized", () => {
    analytics.track("test_event", { foo: "bar" });
    expect(analytics.queue.length).toBe(1);
    expect(analytics.queue[0]).toEqual({
      name: "test_event",
      params: { foo: "bar" },
    });
  });

  it("tracks event if initialized", () => {
    analytics.initialized = true;
    analytics.track("test_event", { foo: "bar" });
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "test_event",
      expect.objectContaining({
        foo: "bar",
        timestamp: expect.any(String),
      })
    );
  });

  it("initializes and processes queue", async () => {
    analytics.queue = [{ name: "test_event", params: { foo: "bar" } }];

    await analytics.initialize();

    expect(analytics.initialized).toBe(true);
    expect(analytics.queue.length).toBe(0);
  });

  it("does not track when analytics is disabled", () => {
    analytics.config.enabled = false;
    analytics.initialized = true;

    analytics.track("test_event", { foo: "bar" });

    expect(window.gtag).not.toHaveBeenCalled();
  });
});
