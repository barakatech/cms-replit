import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPriceAlertSubscriptionSchema, insertNewsletterSignupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Discover Settings
  app.get("/api/discover/settings", async (_req, res) => {
    const settings = await storage.getDiscoverSettings();
    res.json(settings);
  });

  app.put("/api/discover/settings", async (req, res) => {
    try {
      const settings = await storage.updateDiscoverSettings(req.body);
      res.json({ success: true, settings });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update settings" });
    }
  });

  app.get("/api/discover/themes", async (_req, res) => {
    const themes = await storage.getStockThemes();
    res.json(themes);
  });

  app.get("/api/discover/offers", async (_req, res) => {
    const offers = await storage.getOfferBanners();
    res.json(offers);
  });

  // Price Alert Subscription
  app.post("/api/price-alerts/subscribe", async (req, res) => {
    try {
      const data = insertPriceAlertSubscriptionSchema.parse(req.body);
      const subscription = await storage.createPriceAlertSubscription(data);
      res.json({ success: true, subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create subscription" });
      }
    }
  });

  app.get("/api/price-alerts/subscriptions", async (_req, res) => {
    const subscriptions = await storage.getPriceAlertSubscriptions();
    res.json(subscriptions);
  });

  // Newsletter Signup
  app.post("/api/newsletter/signup", async (req, res) => {
    try {
      const data = insertNewsletterSignupSchema.parse(req.body);
      const signup = await storage.createNewsletterSignup(data);
      res.json({ success: true, signup });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to signup" });
      }
    }
  });

  app.get("/api/newsletter/signups", async (_req, res) => {
    const signups = await storage.getNewsletterSignups();
    res.json(signups);
  });

  // ============================================
  // LANDING PAGES API
  // ============================================

  // Get all landing pages
  app.get("/api/landing-pages", async (_req, res) => {
    const pages = await storage.getLandingPages();
    res.json(pages);
  });

  // Get single landing page by ID
  app.get("/api/landing-pages/:id", async (req, res) => {
    const page = await storage.getLandingPage(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Landing page not found" });
    }
    res.json(page);
  });

  // Get landing page by slug (for public rendering)
  app.get("/api/landing-pages/slug/:slug", async (req, res) => {
    const page = await storage.getLandingPageBySlug(req.params.slug);
    if (!page) {
      return res.status(404).json({ error: "Landing page not found" });
    }
    res.json(page);
  });

  // Create landing page
  app.post("/api/landing-pages", async (req, res) => {
    try {
      const page = await storage.createLandingPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create landing page" });
    }
  });

  // Update landing page
  app.put("/api/landing-pages/:id", async (req, res) => {
    try {
      const page = await storage.updateLandingPage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Landing page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update landing page" });
    }
  });

  // Delete landing page
  app.delete("/api/landing-pages/:id", async (req, res) => {
    const success = await storage.deleteLandingPage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Landing page not found" });
    }
    res.json({ success: true });
  });

  // Publish landing page
  app.post("/api/landing-pages/:id/publish", async (req, res) => {
    try {
      const page = await storage.publishLandingPage(req.params.id);
      if (!page) {
        return res.status(404).json({ error: "Landing page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to publish landing page" });
    }
  });

  // Get landing page versions
  app.get("/api/landing-pages/:id/versions", async (req, res) => {
    const versions = await storage.getLandingPageVersions(req.params.id);
    res.json(versions);
  });

  // Create landing page version (manual save point)
  app.post("/api/landing-pages/:id/versions", async (req, res) => {
    try {
      const version = await storage.createLandingPageVersion(req.params.id, req.body.userId);
      res.status(201).json(version);
    } catch (error) {
      res.status(500).json({ error: "Failed to create version" });
    }
  });

  // Get analytics summary for landing page
  app.get("/api/landing-pages/:id/analytics", async (req, res) => {
    const summary = await storage.getAnalyticsSummary(req.params.id);
    res.json(summary);
  });

  // ============================================
  // FORM SUBMISSIONS API
  // ============================================

  // Submit form (public endpoint)
  app.post("/api/forms/submit", async (req, res) => {
    try {
      // Honeypot spam check
      if (req.body._honey) {
        return res.status(200).json({ success: true }); // Silent fail for bots
      }
      
      const submission = await storage.createFormSubmission({
        landingPageId: req.body.landingPageId,
        pageSlug: req.body.pageSlug,
        formKey: req.body.formKey,
        payload: req.body.payload,
        locale: req.body.locale || 'en',
      });
      res.status(201).json({ success: true, submission });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to submit form" });
    }
  });

  // Get form submissions (admin)
  app.get("/api/forms/submissions", async (req, res) => {
    const landingPageId = req.query.landingPageId as string | undefined;
    const submissions = await storage.getFormSubmissions(landingPageId);
    res.json(submissions);
  });

  // ============================================
  // ANALYTICS API
  // ============================================

  // Track analytics event (public endpoint)
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const event = await storage.createAnalyticsEvent({
        landingPageId: req.body.landingPageId,
        pageSlug: req.body.pageSlug,
        sessionId: req.body.sessionId,
        eventType: req.body.eventType,
        metadata: req.body.metadata || {},
      });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to track event" });
    }
  });

  // Get analytics events (admin)
  app.get("/api/analytics/events", async (req, res) => {
    const landingPageId = req.query.landingPageId as string | undefined;
    const events = await storage.getAnalyticsEvents(landingPageId);
    res.json(events);
  });

  const httpServer = createServer(app);
  return httpServer;
}
