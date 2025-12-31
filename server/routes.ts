import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPriceAlertSubscriptionSchema, insertNewsletterSignupSchema } from "@shared/schema";
import type { InsertCmsWebEvent, InsertBannerEvent } from "@shared/schema";
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

  // ============================================
  // CMS WEB EVENTS API (Internal Analytics Pipeline)
  // ============================================

  // Track CMS web event (public endpoint)
  app.post("/api/events", async (req, res) => {
    try {
      const event: InsertCmsWebEvent = {
        eventType: req.body.eventType,
        pagePath: req.body.pagePath,
        locale: req.body.locale || 'en',
        deviceCategory: req.body.deviceCategory || 'desktop',
        userAgentHash: req.body.userAgentHash,
        metaJson: req.body.metaJson || {},
      };
      await storage.createCmsWebEvent(event);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to track event" });
    }
  });

  // Get CMS web events (admin)
  app.get("/api/admin/events", async (req, res) => {
    const filters = {
      eventType: req.query.eventType as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };
    const events = await storage.getCmsWebEvents(filters);
    res.json(events);
  });

  // ============================================
  // BANNER EVENTS API
  // ============================================

  // Track banner event (public endpoint)
  app.post("/api/events/banner", async (req, res) => {
    try {
      const event: InsertBannerEvent = {
        bannerId: req.body.bannerId,
        bannerType: req.body.bannerType,
        eventType: req.body.eventType,
        placement: req.body.placement,
        pagePath: req.body.pagePath,
        locale: req.body.locale || 'en',
        deviceCategory: req.body.deviceCategory || 'desktop',
      };
      await storage.createBannerEvent(event);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to track banner event" });
    }
  });

  // Get banner events (admin)
  app.get("/api/admin/events/banners", async (req, res) => {
    const filters = {
      bannerId: req.query.bannerId as string | undefined,
      bannerType: req.query.bannerType as string | undefined,
    };
    const events = await storage.getBannerEvents(filters);
    res.json(events);
  });

  // ============================================
  // MOBILE INSTALL BANNER API
  // ============================================

  // Get all mobile install banners (admin)
  app.get("/api/admin/mobile-install-banners", async (_req, res) => {
    const banners = await storage.getMobileInstallBanners();
    res.json(banners);
  });

  // Get active mobile install banner (public)
  app.get("/api/mobile-install-banner", async (_req, res) => {
    const banner = await storage.getActiveMobileInstallBanner();
    if (!banner) {
      return res.status(404).json({ error: "No active banner" });
    }
    res.json(banner);
  });

  // Get single mobile install banner (admin)
  app.get("/api/admin/mobile-install-banners/:id", async (req, res) => {
    const banner = await storage.getMobileInstallBanner(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  });

  // Create mobile install banner (admin)
  app.post("/api/admin/mobile-install-banners", async (req, res) => {
    try {
      const banner = await storage.createMobileInstallBanner(req.body);
      res.status(201).json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to create banner" });
    }
  });

  // Update mobile install banner (admin)
  app.put("/api/admin/mobile-install-banners/:id", async (req, res) => {
    try {
      const banner = await storage.updateMobileInstallBanner(req.params.id, req.body);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      res.status(500).json({ error: "Failed to update banner" });
    }
  });

  // Delete mobile install banner (admin)
  app.delete("/api/admin/mobile-install-banners/:id", async (req, res) => {
    const success = await storage.deleteMobileInstallBanner(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // ANALYTICS SETTINGS API
  // ============================================

  // Get analytics settings (admin)
  app.get("/api/admin/analytics/settings", async (_req, res) => {
    const settings = await storage.getAnalyticsSettings();
    res.json(settings);
  });

  // Update analytics settings (admin)
  app.put("/api/admin/analytics/settings", async (req, res) => {
    try {
      const settings = await storage.updateAnalyticsSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update analytics settings" });
    }
  });

  // ============================================
  // DASHBOARD SUMMARY API
  // ============================================

  // Get dashboard summary (admin)
  app.get("/api/admin/analytics/summary", async (req, res) => {
    const range = req.query.range as string || '7d';
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '28d':
        startDate.setDate(endDate.getDate() - 28);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    const summary = await storage.getDashboardSummary({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
    res.json(summary);
  });

  // ============================================
  // BLOG POSTS API
  // ============================================

  // Get all blog posts
  app.get("/api/blog-posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  // Get single blog post by ID
  app.get("/api/blog-posts/:id", async (req, res) => {
    const post = await storage.getBlogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  });

  // Get blog post by slug (public)
  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  });

  // Create blog post (admin)
  app.post("/api/blog-posts", async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  // Update blog post (admin)
  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  // Delete blog post (admin)
  app.delete("/api/blog-posts/:id", async (req, res) => {
    const success = await storage.deleteBlogPost(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // STOCK PAGES API
  // ============================================

  // Get all stock pages
  app.get("/api/stock-pages", async (_req, res) => {
    const pages = await storage.getStockPages();
    res.json(pages);
  });

  // Get single stock page by ID
  app.get("/api/stock-pages/:id", async (req, res) => {
    const page = await storage.getStockPage(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Stock page not found" });
    }
    res.json(page);
  });

  // Get stock page by slug (public)
  app.get("/api/stock-pages/slug/:slug", async (req, res) => {
    const page = await storage.getStockPageBySlug(req.params.slug);
    if (!page) {
      return res.status(404).json({ error: "Stock page not found" });
    }
    res.json(page);
  });

  // Create stock page (admin)
  app.post("/api/stock-pages", async (req, res) => {
    try {
      const page = await storage.createStockPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create stock page" });
    }
  });

  // Update stock page (admin)
  app.put("/api/stock-pages/:id", async (req, res) => {
    try {
      const page = await storage.updateStockPage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Stock page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock page" });
    }
  });

  // Delete stock page (admin)
  app.delete("/api/stock-pages/:id", async (req, res) => {
    const success = await storage.deleteStockPage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Stock page not found" });
    }
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
