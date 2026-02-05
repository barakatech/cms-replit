import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPriceAlertSubscriptionSchema, insertStockWatchSubscriptionSchema, insertNewsletterSignupSchema, insertCallToActionSchema, insertCTAEventSchema, insertNewsletterSchema, insertSpotlightBannerSchema, insertSubscriberSchema, insertComplianceScanRunSchema, insertComplianceRuleSchema, insertSchemaBlockSchema } from "@shared/schema";
import type { InsertCmsWebEvent, InsertBannerEvent, UserPresence, PresenceMessage } from "@shared/schema";
import { PRESENCE_COLORS } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { EnglishIssue } from "@shared/schema";

// Basic English lint helper for fallback mode
function runBasicEnglishLint(text: string): EnglishIssue[] {
  const issues: EnglishIssue[] = [];
  
  // Common spelling/typo patterns
  const commonMistakes: { pattern: RegExp; type: 'spelling' | 'grammar' | 'clarity' | 'tone'; message: string; suggestion: string }[] = [
    { pattern: /\bteh\b/gi, type: 'spelling', message: 'Possible typo: "teh"', suggestion: 'the' },
    { pattern: /\brecieve\b/gi, type: 'spelling', message: 'Misspelling: "recieve"', suggestion: 'receive' },
    { pattern: /\boccured\b/gi, type: 'spelling', message: 'Misspelling: "occured"', suggestion: 'occurred' },
    { pattern: /\bseperate\b/gi, type: 'spelling', message: 'Misspelling: "seperate"', suggestion: 'separate' },
    { pattern: /\bdefinately\b/gi, type: 'spelling', message: 'Misspelling: "definately"', suggestion: 'definitely' },
    { pattern: /\s{2,}/g, type: 'clarity', message: 'Multiple consecutive spaces', suggestion: ' ' },
    { pattern: /\bi\b/g, type: 'grammar', message: 'Lowercase "i" should be capitalized', suggestion: 'I' },
    { pattern: /[.!?]\s*[a-z]/g, type: 'grammar', message: 'Sentence should start with capital letter', suggestion: '' },
  ];
  
  for (const mistake of commonMistakes) {
    let match;
    while ((match = mistake.pattern.exec(text)) !== null) {
      issues.push({
        type: mistake.type,
        severity: 'low',
        message: mistake.message,
        start: match.index,
        end: match.index + match[0].length,
        suggestion: mistake.suggestion,
      });
    }
  }
  
  return issues;
}

// Presence management
const activePresences = new Map<string, UserPresence>();
const wsClients = new Map<WebSocket, string>(); // ws -> presence id

function broadcastPresence(message: PresenceMessage, excludeWs?: WebSocket) {
  const payload = JSON.stringify(message);
  wsClients.forEach((_, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

function cleanupStalePresences() {
  const now = Date.now();
  const staleThreshold = 30000; // 30 seconds
  activePresences.forEach((presence, id) => {
    if (now - presence.lastActive > staleThreshold) {
      activePresences.delete(id);
      broadcastPresence({
        type: 'leave',
        presence,
        timestamp: now,
      });
    }
  });
}

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

  app.get("/api/discover/themes/:slug", async (req, res) => {
    const theme = await storage.getStockThemeBySlug(req.params.slug);
    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }
    res.json(theme);
  });

  app.get("/api/discover/collections", async (_req, res) => {
    const collections = await storage.getStockCollections();
    res.json(collections);
  });

  app.get("/api/discover/collections/:slug", async (req, res) => {
    const collection = await storage.getStockCollectionBySlug(req.params.slug);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.json(collection);
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

  // Stock Watch Subscription
  app.post("/api/stock-watch/subscribe", async (req, res) => {
    try {
      const data = insertStockWatchSubscriptionSchema.parse(req.body);
      const subscription = await storage.createStockWatchSubscription(data);
      res.json({ success: true, subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create watch subscription" });
      }
    }
  });

  app.get("/api/stock-watch/subscriptions", async (_req, res) => {
    const subscriptions = await storage.getStockWatchSubscriptions();
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
  // ASSET LINKS API (Curated stock collections)
  // ============================================

  // Get asset links by collection key
  app.get("/api/admin/asset-links/:collectionKey", async (req, res) => {
    const links = await storage.getAssetLinks(req.params.collectionKey);
    res.json(links);
  });

  // Create asset link
  app.post("/api/admin/asset-links", async (req, res) => {
    try {
      const link = await storage.createAssetLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      res.status(500).json({ error: "Failed to create asset link" });
    }
  });

  // Update asset link
  app.put("/api/admin/asset-links/:id", async (req, res) => {
    try {
      const link = await storage.updateAssetLink(req.params.id, req.body);
      if (!link) {
        return res.status(404).json({ error: "Asset link not found" });
      }
      res.json(link);
    } catch (error) {
      res.status(500).json({ error: "Failed to update asset link" });
    }
  });

  // Delete asset link
  app.delete("/api/admin/asset-links/:id", async (req, res) => {
    const success = await storage.deleteAssetLink(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Asset link not found" });
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

  // Get dashboard summary (admin) - supports both query params and path params
  app.get("/api/admin/analytics/summary/:range?", async (req, res) => {
    const range = req.params.range || req.query.range as string || '7d';
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

  // Get traffic time series data (admin) - supports path params
  app.get("/api/admin/analytics/traffic/:range/:filter", async (req, res) => {
    const range = req.params.range || '7d';
    const filter = (req.params.filter as 'all' | 'stocks' | 'blogs') || 'all';
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
    
    const trafficData = await storage.getTrafficTimeSeries(
      { start: startDate.toISOString(), end: endDate.toISOString() },
      filter
    );
    res.json(trafficData);
  });

  // ============================================
  // MARKETING PIXELS API
  // ============================================

  // Get all marketing pixels (admin)
  app.get("/api/admin/marketing-pixels", async (_req, res) => {
    const pixels = await storage.getMarketingPixels();
    res.json(pixels);
  });

  // Get enabled marketing pixels (public - for client-side tracking)
  app.get("/api/marketing-pixels/enabled", async (_req, res) => {
    const pixels = await storage.getEnabledMarketingPixels();
    // Get event maps for all enabled pixels
    const pixelsWithMaps = await Promise.all(
      pixels.map(async (pixel) => {
        const eventMaps = await storage.getPixelEventMaps(pixel.id);
        return { ...pixel, eventMaps };
      })
    );
    res.json(pixelsWithMaps);
  });

  // Get single marketing pixel by ID
  app.get("/api/admin/marketing-pixels/:id", async (req, res) => {
    const pixel = await storage.getMarketingPixel(req.params.id);
    if (!pixel) {
      return res.status(404).json({ error: "Marketing pixel not found" });
    }
    // Include event maps
    const eventMaps = await storage.getPixelEventMaps(pixel.id);
    res.json({ ...pixel, eventMaps });
  });

  // Create marketing pixel (admin)
  app.post("/api/admin/marketing-pixels", async (req, res) => {
    try {
      const pixel = await storage.createMarketingPixel(req.body);
      res.status(201).json(pixel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create marketing pixel" });
    }
  });

  // Update marketing pixel (admin)
  app.put("/api/admin/marketing-pixels/:id", async (req, res) => {
    try {
      const pixel = await storage.updateMarketingPixel(req.params.id, req.body);
      if (!pixel) {
        return res.status(404).json({ error: "Marketing pixel not found" });
      }
      res.json(pixel);
    } catch (error) {
      res.status(500).json({ error: "Failed to update marketing pixel" });
    }
  });

  // Delete marketing pixel (admin)
  app.delete("/api/admin/marketing-pixels/:id", async (req, res) => {
    const success = await storage.deleteMarketingPixel(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Marketing pixel not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // PIXEL EVENT MAPPINGS API
  // ============================================

  // Get pixel event maps (optionally filtered by pixel ID)
  app.get("/api/admin/pixel-event-maps", async (req, res) => {
    const pixelId = req.query.pixelId as string | undefined;
    const maps = await storage.getPixelEventMaps(pixelId);
    res.json(maps);
  });

  // Get single pixel event map by ID
  app.get("/api/admin/pixel-event-maps/:id", async (req, res) => {
    const map = await storage.getPixelEventMap(req.params.id);
    if (!map) {
      return res.status(404).json({ error: "Pixel event map not found" });
    }
    res.json(map);
  });

  // Create pixel event map (admin)
  app.post("/api/admin/pixel-event-maps", async (req, res) => {
    try {
      const map = await storage.createPixelEventMap(req.body);
      res.status(201).json(map);
    } catch (error) {
      res.status(500).json({ error: "Failed to create pixel event map" });
    }
  });

  // Update pixel event map (admin)
  app.put("/api/admin/pixel-event-maps/:id", async (req, res) => {
    try {
      const map = await storage.updatePixelEventMap(req.params.id, req.body);
      if (!map) {
        return res.status(404).json({ error: "Pixel event map not found" });
      }
      res.json(map);
    } catch (error) {
      res.status(500).json({ error: "Failed to update pixel event map" });
    }
  });

  // Delete pixel event map (admin)
  app.delete("/api/admin/pixel-event-maps/:id", async (req, res) => {
    const success = await storage.deletePixelEventMap(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Pixel event map not found" });
    }
    res.json({ success: true });
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

  // ============================================
  // PUBLIC STOCK THEME & LANDING PAGE ROUTES
  // ============================================

  // Get all published stock themes (public)
  app.get("/api/stocks/themes", async (_req, res) => {
    const themes = await storage.getStockThemes();
    const publishedThemes = themes.filter(t => t.status === 'published');
    res.json(publishedThemes);
  });

  // Get theme detail with associated stocks (public)
  app.get("/api/stocks/themes/:slug", async (req, res) => {
    const theme = await storage.getStockThemeBySlug(req.params.slug);
    if (!theme || theme.status !== 'published') {
      return res.status(404).json({ error: "Theme not found" });
    }

    // Get stock pages for this theme's tickers
    const allStocks = await storage.getStockPages();
    const themeStocks = allStocks.filter(stock => 
      theme.tickers.includes(stock.ticker) && stock.status === 'published'
    ).map(stock => ({
      id: stock.id,
      ticker: stock.ticker,
      slug: stock.slug,
      companyName_en: stock.companyName_en,
      companyName_ar: stock.companyName_ar,
      exchange: stock.exchange,
      currency: stock.currency,
      tags: stock.tags,
    }));

    res.json({
      ...theme,
      stocks: themeStocks,
    });
  });

  // Get stock landing page by slug (public)
  app.get("/api/stocks/:slug", async (req, res) => {
    const stock = await storage.getStockPageBySlug(req.params.slug);
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }
    // Allow draft stocks in preview mode (check query param)
    const isPreview = req.query.preview === 'true';
    if (stock.status !== 'published' && !isPreview) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.json(stock);
  });

  // Get stocks for a specific theme by theme ID (public)
  app.get("/api/stocks/themes/:slug/stocks", async (req, res) => {
    const theme = await storage.getStockThemeBySlug(req.params.slug);
    if (!theme || theme.status !== 'published') {
      return res.status(404).json({ error: "Theme not found" });
    }

    const allStocks = await storage.getStockPages();
    const themeStocks = allStocks.filter(stock => 
      theme.tickers.includes(stock.ticker) && stock.status === 'published'
    );

    res.json(themeStocks);
  });

  // ============================================
  // REST API for Presence (fallback)
  // ============================================

  // Get active presences for a content item
  app.get("/api/presence/:contentType/:contentId", (req, res) => {
    const { contentType, contentId } = req.params;
    const presences = Array.from(activePresences.values()).filter(
      p => p.contentType === contentType && p.contentId === contentId
    );
    res.json(presences);
  });

  // Get all active presences
  app.get("/api/presence", (_req, res) => {
    res.json(Array.from(activePresences.values()));
  });

  // ============================================
  // App Download Config
  // ============================================
  
  app.get("/api/app-download-config", async (_req, res) => {
    const config = await storage.getAppDownloadConfig();
    res.json(config);
  });

  app.put("/api/app-download-config", async (req, res) => {
    try {
      const config = await storage.updateAppDownloadConfig(req.body);
      res.json({ success: true, config });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update app download config" });
    }
  });

  // ============================================
  // CTA Registry Routes
  // ============================================
  
  app.get("/api/ctas", async (_req, res) => {
    const ctas = await storage.getCallToActions();
    res.json(ctas);
  });

  app.get("/api/ctas/key/:key", async (req, res) => {
    const cta = await storage.getCallToActionByKey(req.params.key);
    if (!cta) {
      return res.status(404).json({ error: "CTA not found" });
    }
    res.json(cta);
  });

  app.get("/api/ctas/:id", async (req, res) => {
    const cta = await storage.getCallToAction(req.params.id);
    if (!cta) {
      return res.status(404).json({ error: "CTA not found" });
    }
    res.json(cta);
  });

  app.post("/api/ctas", async (req, res) => {
    try {
      const data = insertCallToActionSchema.parse(req.body);
      const cta = await storage.createCallToAction(data);
      res.status(201).json(cta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create CTA" });
    }
  });

  app.put("/api/ctas/:id", async (req, res) => {
    try {
      const updateSchema = insertCallToActionSchema.partial();
      const data = updateSchema.parse(req.body);
      const cta = await storage.updateCallToAction(req.params.id, data);
      if (!cta) {
        return res.status(404).json({ error: "CTA not found" });
      }
      res.json(cta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to update CTA" });
    }
  });

  app.delete("/api/ctas/:id", async (req, res) => {
    const success = await storage.deleteCallToAction(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "CTA not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // CTA Events Routes
  // ============================================
  
  app.post("/api/cta-events", async (req, res) => {
    try {
      const data = insertCTAEventSchema.parse(req.body);
      const event = await storage.createCTAEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create CTA event" });
    }
  });

  app.get("/api/cta-events", async (req, res) => {
    const filters = {
      ctaKey: req.query.ctaKey as string | undefined,
      eventType: req.query.eventType as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };
    const events = await storage.getCTAEvents(filters);
    res.json(events);
  });

  app.get("/api/cta-performance", async (_req, res) => {
    const performance = await storage.getCTAPerformance();
    res.json(performance);
  });

  // ============================================
  // NEWSLETTER TEMPLATES API
  // ============================================

  app.get("/api/newsletter-templates", async (_req, res) => {
    const templates = await storage.getNewsletterTemplates();
    res.json(templates);
  });

  app.get("/api/newsletter-templates/:id", async (req, res) => {
    const template = await storage.getNewsletterTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Newsletter template not found" });
    }
    res.json(template);
  });

  app.post("/api/newsletter-templates", async (req, res) => {
    try {
      const template = await storage.createNewsletterTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create newsletter template" });
    }
  });

  app.put("/api/newsletter-templates/:id", async (req, res) => {
    try {
      const template = await storage.updateNewsletterTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Newsletter template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update newsletter template" });
    }
  });

  app.delete("/api/newsletter-templates/:id", async (req, res) => {
    const success = await storage.deleteNewsletterTemplate(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Newsletter template not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // SCHEMA BLOCKS API (reusable newsletter modules)
  // ============================================

  app.get("/api/schema-blocks", async (req, res) => {
    let blocks = await storage.getSchemaBlocks();
    
    const locale = req.query.locale as string | undefined;
    const type = req.query.type as string | undefined;
    
    if (locale) {
      blocks = blocks.filter(b => b.locale === locale || b.locale === 'global');
    }
    if (type) {
      blocks = blocks.filter(b => b.type === type);
    }
    
    res.json(blocks);
  });

  app.get("/api/schema-blocks/:id", async (req, res) => {
    const block = await storage.getSchemaBlock(req.params.id);
    if (!block) {
      return res.status(404).json({ error: "Schema block not found" });
    }
    res.json(block);
  });

  app.post("/api/schema-blocks", async (req, res) => {
    try {
      const data = insertSchemaBlockSchema.parse(req.body);
      const block = await storage.createSchemaBlock(data);
      res.status(201).json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create schema block" });
    }
  });

  app.put("/api/schema-blocks/:id", async (req, res) => {
    try {
      const block = await storage.updateSchemaBlock(req.params.id, req.body);
      if (!block) {
        return res.status(404).json({ error: "Schema block not found" });
      }
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: "Failed to update schema block" });
    }
  });

  app.delete("/api/schema-blocks/:id", async (req, res) => {
    const success = await storage.deleteSchemaBlock(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Schema block not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // SCHEMA BLOCK DEFINITIONS API (canonical structure + defaults)
  // ============================================

  app.get("/api/schema-block-definitions", async (req, res) => {
    const definitions = await storage.getSchemaBlockDefinitions();
    res.json(definitions);
  });

  app.get("/api/schema-block-definitions/:id", async (req, res) => {
    const def = await storage.getSchemaBlockDefinition(req.params.id);
    if (!def) {
      return res.status(404).json({ error: "Schema block definition not found" });
    }
    res.json(def);
  });

  app.get("/api/schema-block-definitions/by-type/:blockType", async (req, res) => {
    const def = await storage.getSchemaBlockDefinitionByType(req.params.blockType);
    if (!def) {
      return res.status(404).json({ error: "Schema block definition not found for this type" });
    }
    res.json(def);
  });

  app.post("/api/schema-block-definitions", async (req, res) => {
    try {
      const { blockType, name, description, defaultSchemaJson, defaultSettingsJson } = req.body;
      if (!blockType || !name) {
        return res.status(400).json({ error: "blockType and name are required" });
      }
      const def = await storage.createSchemaBlockDefinition({
        blockType,
        name,
        description: description || '',
        defaultSchemaJson: defaultSchemaJson || {},
        defaultSettingsJson: defaultSettingsJson || {},
      });
      res.status(201).json(def);
    } catch (error) {
      res.status(500).json({ error: "Failed to create schema block definition" });
    }
  });

  app.put("/api/schema-block-definitions/:id", async (req, res) => {
    try {
      const def = await storage.updateSchemaBlockDefinition(req.params.id, req.body);
      if (!def) {
        return res.status(404).json({ error: "Schema block definition not found" });
      }
      res.json(def);
    } catch (error) {
      res.status(500).json({ error: "Failed to update schema block definition" });
    }
  });

  app.delete("/api/schema-block-definitions/:id", async (req, res) => {
    const success = await storage.deleteSchemaBlockDefinition(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Schema block definition not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // TEMPLATE BLOCK OVERRIDES API (template-level settings)
  // ============================================

  app.get("/api/newsletter-templates/:templateId/block-overrides", async (req, res) => {
    const overrides = await storage.getTemplateBlockOverrides(req.params.templateId);
    res.json(overrides);
  });

  app.get("/api/newsletter-templates/:templateId/block-overrides/:blockType", async (req, res) => {
    const override = await storage.getTemplateBlockOverride(req.params.templateId, req.params.blockType);
    if (!override) {
      return res.status(404).json({ error: "Template block override not found" });
    }
    res.json(override);
  });

  app.post("/api/newsletter-templates/:templateId/block-overrides", async (req, res) => {
    try {
      const { blockType, overrideSettingsJson } = req.body;
      if (!blockType) {
        return res.status(400).json({ error: "blockType is required" });
      }
      const override = await storage.createTemplateBlockOverride({
        templateId: req.params.templateId,
        blockType,
        overrideSettingsJson: overrideSettingsJson || {},
      });
      res.status(201).json(override);
    } catch (error) {
      res.status(500).json({ error: "Failed to create template block override" });
    }
  });

  app.put("/api/template-block-overrides/:id", async (req, res) => {
    try {
      const override = await storage.updateTemplateBlockOverride(req.params.id, req.body);
      if (!override) {
        return res.status(404).json({ error: "Template block override not found" });
      }
      res.json(override);
    } catch (error) {
      res.status(500).json({ error: "Failed to update template block override" });
    }
  });

  app.delete("/api/template-block-overrides/:id", async (req, res) => {
    const success = await storage.deleteTemplateBlockOverride(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Template block override not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // BLOCK LIBRARY TEMPLATES API
  // ============================================

  app.get("/api/block-library-templates", async (req, res) => {
    const templates = await storage.getBlockLibraryTemplates();
    res.json(templates);
  });

  app.get("/api/block-library-templates/:id", async (req, res) => {
    const template = await storage.getBlockLibraryTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Block library template not found" });
    }
    res.json(template);
  });

  app.post("/api/block-library-templates", async (req, res) => {
    try {
      const { name, blockType, blockDataJson } = req.body;
      if (!name || !blockType) {
        return res.status(400).json({ error: "Name and blockType are required" });
      }
      const template = await storage.createBlockLibraryTemplate({
        name,
        blockType,
        blockDataJson: blockDataJson || {},
      });
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create block library template" });
    }
  });

  app.put("/api/block-library-templates/:id", async (req, res) => {
    try {
      const template = await storage.updateBlockLibraryTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Block library template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update block library template" });
    }
  });

  app.delete("/api/block-library-templates/:id", async (req, res) => {
    const success = await storage.deleteBlockLibraryTemplate(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Block library template not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // NEWSLETTER BLOCK INSTANCES API
  // ============================================

  app.get("/api/newsletters/:id/blocks", async (req, res) => {
    const blocks = await storage.getNewsletterBlockInstances(req.params.id);
    res.json(blocks);
  });

  app.post("/api/newsletters/:id/blocks/add", async (req, res) => {
    try {
      const { blockType, blockDataJson, sortOrder } = req.body;
      if (!blockType) {
        return res.status(400).json({ error: "blockType is required" });
      }
      const blocks = await storage.getNewsletterBlockInstances(req.params.id);
      const newSortOrder = sortOrder ?? blocks.length;
      const instance = await storage.createNewsletterBlockInstance({
        newsletterId: req.params.id,
        blockType,
        blockDataJson: blockDataJson || {},
        sortOrder: newSortOrder,
      });
      res.status(201).json(instance);
    } catch (error) {
      res.status(500).json({ error: "Failed to add block instance" });
    }
  });

  app.post("/api/newsletters/:newsletterId/blocks/:blockId/update", async (req, res) => {
    try {
      const block = await storage.getNewsletterBlockInstance(req.params.blockId);
      if (!block || block.newsletterId !== req.params.newsletterId) {
        return res.status(404).json({ error: "Block instance not found" });
      }
      
      const updateData: Partial<{ blockDataJson: Record<string, unknown>; overrideSettingsJson: Record<string, unknown>; sortOrder: number }> = {};
      
      if (req.body.blockDataJson !== undefined) {
        if (typeof req.body.blockDataJson !== 'object' || req.body.blockDataJson === null) {
          return res.status(400).json({ error: "blockDataJson must be an object" });
        }
        updateData.blockDataJson = req.body.blockDataJson;
      }
      
      if (req.body.overrideSettingsJson !== undefined) {
        if (typeof req.body.overrideSettingsJson !== 'object' || req.body.overrideSettingsJson === null) {
          return res.status(400).json({ error: "overrideSettingsJson must be an object" });
        }
        updateData.overrideSettingsJson = req.body.overrideSettingsJson;
      }
      
      if (req.body.sortOrder !== undefined) {
        if (typeof req.body.sortOrder !== 'number') {
          return res.status(400).json({ error: "sortOrder must be a number" });
        }
        updateData.sortOrder = req.body.sortOrder;
      }
      
      const updated = await storage.updateNewsletterBlockInstance(req.params.blockId, updateData);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update block instance" });
    }
  });

  app.get("/api/newsletters/:newsletterId/blocks/:blockId/merged-settings", async (req, res) => {
    try {
      const block = await storage.getNewsletterBlockInstance(req.params.blockId);
      if (!block || block.newsletterId !== req.params.newsletterId) {
        return res.status(404).json({ error: "Block instance not found" });
      }

      const newsletter = await storage.getNewsletter(req.params.newsletterId);
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }

      const schemaDefinition = await storage.getSchemaBlockDefinitionByType(block.blockType);
      const schemaDefaults = (schemaDefinition?.defaultSettingsJson as Record<string, unknown>) || {};

      let templateOverrides: Record<string, unknown> = {};
      if (newsletter.templateId) {
        const templateOverride = await storage.getTemplateBlockOverride(newsletter.templateId, block.blockType);
        templateOverrides = (templateOverride?.overrideSettingsJson as Record<string, unknown>) || {};
      }

      const issueOverrides = (block.overrideSettingsJson as Record<string, unknown>) || {};

      const mergedSettings: Record<string, unknown> = {
        ...schemaDefaults,
        ...templateOverrides,
        ...issueOverrides,
      };

      res.json({
        blockId: block.id,
        blockType: block.blockType,
        mergedSettings,
        layers: {
          schemaDefaults,
          templateOverrides,
          issueOverrides,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get merged settings" });
    }
  });

  app.post("/api/newsletters/:newsletterId/blocks/:blockId/delete", async (req, res) => {
    const block = await storage.getNewsletterBlockInstance(req.params.blockId);
    if (!block || block.newsletterId !== req.params.newsletterId) {
      return res.status(404).json({ error: "Block instance not found" });
    }
    const success = await storage.deleteNewsletterBlockInstance(req.params.blockId);
    if (!success) {
      return res.status(500).json({ error: "Failed to delete block instance" });
    }
    res.json({ success: true });
  });

  app.post("/api/newsletters/:id/blocks/reorder", async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: "orderedIds must be an array" });
      }
      const success = await storage.reorderNewsletterBlockInstances(req.params.id, orderedIds);
      if (!success) {
        return res.status(400).json({ error: "Failed to reorder blocks" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder block instances" });
    }
  });

  // ============================================
  // NEWSLETTERS API
  // ============================================

  app.get("/api/newsletters", async (req, res) => {
    let newsletters = await storage.getNewsletters();
    
    const locale = req.query.locale as string | undefined;
    const status = req.query.status as string | undefined;
    
    if (locale) {
      newsletters = newsletters.filter(n => n.locale === locale);
    }
    if (status) {
      newsletters = newsletters.filter(n => n.status === status);
    }
    
    res.json(newsletters);
  });

  app.get("/api/newsletters/:id", async (req, res) => {
    const newsletter = await storage.getNewsletter(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    res.json(newsletter);
  });

  app.post("/api/newsletters", async (req, res) => {
    try {
      const data = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.createNewsletter(data);
      res.status(201).json(newsletter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create newsletter" });
    }
  });

  app.put("/api/newsletters/:id", async (req, res) => {
    try {
      const newsletter = await storage.updateNewsletter(req.params.id, req.body);
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }
      res.json(newsletter);
    } catch (error) {
      res.status(500).json({ error: "Failed to update newsletter" });
    }
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    const success = await storage.deleteNewsletter(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    res.json({ success: true });
  });

  app.post("/api/newsletters/:id/send-test", async (req, res) => {
    try {
      const newsletter = await storage.getNewsletter(req.params.id);
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }
      
      // Mock test send - log the event and update lastTestSentAt
      console.log(`[Newsletter Test Send] Newsletter ID: ${req.params.id}, Subject: ${newsletter.subject}`);
      
      const updated = await storage.updateNewsletter(req.params.id, {
        lastTestSentAt: new Date().toISOString(),
      });
      
      // Create audit log for test send
      await storage.createAuditLog({
        actorUserId: req.body.userId || 'system',
        actorName: req.body.userName || 'System',
        actionType: 'newsletter_test_sent',
        entityType: 'newsletter',
        entityId: req.params.id,
        metaJson: { testEmail: req.body.testEmail },
      });
      
      res.json({ success: true, newsletter: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to send test newsletter" });
    }
  });

  app.post("/api/newsletters/:id/send", async (req, res) => {
    try {
      const newsletter = await storage.getNewsletter(req.params.id);
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }
      
      // Mock send - set status to 'sent' and sentAt
      console.log(`[Newsletter Send] Newsletter ID: ${req.params.id}, Subject: ${newsletter.subject}`);
      
      const updated = await storage.updateNewsletter(req.params.id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
      });
      
      // Create audit log for send
      await storage.createAuditLog({
        actorUserId: req.body.userId || 'system',
        actorName: req.body.userName || 'System',
        actionType: 'newsletter_sent',
        entityType: 'newsletter',
        entityId: req.params.id,
      });
      
      res.json({ success: true, newsletter: updated });
    } catch (error) {
      res.status(500).json({ error: "Failed to send newsletter" });
    }
  });

  // ============================================
  // SPOTLIGHT BANNERS API
  // ============================================

  app.get("/api/spotlights", async (req, res) => {
    let spotlights = await storage.getSpotlightBanners();
    
    const locale = req.query.locale as string | undefined;
    const status = req.query.status as string | undefined;
    const placement = req.query.placement as string | undefined;
    
    if (locale) {
      spotlights = spotlights.filter(s => s.locale === locale);
    }
    if (status) {
      spotlights = spotlights.filter(s => s.status === status);
    }
    if (placement) {
      spotlights = spotlights.filter(s => s.placements.includes(placement as any));
    }
    
    res.json(spotlights);
  });

  app.get("/api/spotlights/active", async (req, res) => {
    const placement = req.query.placement as string | undefined;
    const spotlights = await storage.getActiveSpotlights(placement);
    res.json(spotlights);
  });

  app.get("/api/spotlights/:id", async (req, res) => {
    const spotlight = await storage.getSpotlightBanner(req.params.id);
    if (!spotlight) {
      return res.status(404).json({ error: "Spotlight banner not found" });
    }
    res.json(spotlight);
  });

  app.post("/api/spotlights", async (req, res) => {
    try {
      const data = insertSpotlightBannerSchema.parse(req.body);
      const spotlight = await storage.createSpotlightBanner(data);
      res.status(201).json(spotlight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create spotlight banner" });
    }
  });

  app.put("/api/spotlights/:id", async (req, res) => {
    try {
      const spotlight = await storage.updateSpotlightBanner(req.params.id, req.body);
      if (!spotlight) {
        return res.status(404).json({ error: "Spotlight banner not found" });
      }
      res.json(spotlight);
    } catch (error) {
      res.status(500).json({ error: "Failed to update spotlight banner" });
    }
  });

  app.delete("/api/spotlights/:id", async (req, res) => {
    const success = await storage.deleteSpotlightBanner(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Spotlight banner not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // SUBSCRIBERS API
  // ============================================

  app.get("/api/subscribers", async (req, res) => {
    let subscribers = await storage.getSubscribers();
    
    const locale = req.query.locale as string | undefined;
    const status = req.query.status as string | undefined;
    const tag = req.query.tag as string | undefined;
    
    if (locale) {
      subscribers = subscribers.filter(s => s.locale === locale);
    }
    if (status) {
      subscribers = subscribers.filter(s => s.status === status);
    }
    if (tag) {
      subscribers = subscribers.filter(s => s.tags.includes(tag));
    }
    
    res.json(subscribers);
  });

  app.get("/api/subscribers/:id", async (req, res) => {
    const subscriber = await storage.getSubscriber(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.json(subscriber);
  });

  app.post("/api/subscribers", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(data);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.errors });
      }
      res.status(500).json({ error: "Failed to create subscriber" });
    }
  });

  app.put("/api/subscribers/:id", async (req, res) => {
    try {
      const subscriber = await storage.updateSubscriber(req.params.id, req.body);
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.json(subscriber);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscriber" });
    }
  });

  app.delete("/api/subscribers/:id", async (req, res) => {
    const success = await storage.deleteSubscriber(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.json({ success: true });
  });

  // ============================================
  // AUDIT LOGS API
  // ============================================

  app.get("/api/audit-logs", async (req, res) => {
    const filters = {
      entityType: req.query.entityType as string | undefined,
      entityId: req.query.entityId as string | undefined,
    };
    
    let logs = await storage.getAuditLogs(filters);
    
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    if (limit && limit > 0) {
      logs = logs.slice(0, limit);
    }
    
    res.json(logs);
  });

  // ============================================
  // NEWSLETTER SETTINGS API
  // ============================================

  app.get("/api/newsletter-settings", async (_req, res) => {
    const settings = await storage.getNewsletterSettings();
    res.json(settings);
  });

  app.put("/api/newsletter-settings", async (req, res) => {
    try {
      const settings = await storage.updateNewsletterSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update newsletter settings" });
    }
  });

  // ============================================
  // TEAM MEMBERS API
  // ============================================

  app.get("/api/team-members", async (_req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.get("/api/team-members/:id", async (req, res) => {
    const member = await storage.getTeamMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const member = await storage.createTeamMember(req.body);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.patch("/api/team-members/:id", async (req, res) => {
    const member = await storage.updateTeamMember(req.params.id, req.body);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    const deleted = await storage.deleteTeamMember(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.status(204).send();
  });

  // ============================================
  // CMS SETTINGS API
  // ============================================

  app.get("/api/cms-settings", async (_req, res) => {
    const settings = await storage.getCmsSettings();
    res.json(settings);
  });

  app.put("/api/cms-settings", async (req, res) => {
    try {
      const settings = await storage.updateCmsSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update CMS settings" });
    }
  });

  // Stock SEO Templates
  app.get("/api/settings/stock-seo-templates", async (_req, res) => {
    const templates = await storage.getStockSeoTemplates();
    res.json(templates);
  });

  app.put("/api/settings/stock-seo-templates", async (req, res) => {
    try {
      const templates = await storage.updateStockSeoTemplates(req.body);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock SEO templates" });
    }
  });

  // ============================================
  // COMPLIANCE CHECKER
  // ============================================

  // Compliance Scan Runs
  app.get("/api/compliance/scans", async (req, res) => {
    const contentType = req.query.contentType as string | undefined;
    const approvalStatus = req.query.approvalStatus as string | undefined;
    const scans = await storage.getComplianceScanRuns({ contentType, approvalStatus });
    res.json(scans);
  });

  app.get("/api/compliance/scans/:id", async (req, res) => {
    const scan = await storage.getComplianceScanRun(req.params.id);
    if (!scan) return res.status(404).json({ error: "Scan not found" });
    res.json(scan);
  });

  app.post("/api/compliance/scans", async (req, res) => {
    try {
      const validatedData = insertComplianceScanRunSchema.parse(req.body);
      const scan = await storage.createComplianceScanRun(validatedData);
      
      // Log audit event
      await storage.createAuditLog({
        entityType: 'compliance_scan',
        entityId: scan.id,
        actionType: 'scan_created',
        actorUserId: validatedData.scannedBy || 'system',
        actorName: 'System',
        metaJson: { contentType: scan.contentType, contentId: scan.contentId },
      });
      
      res.status(201).json(scan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create compliance scan" });
    }
  });

  app.put("/api/compliance/scans/:id", async (req, res) => {
    const scan = await storage.updateComplianceScanRun(req.params.id, req.body);
    if (!scan) return res.status(404).json({ error: "Scan not found" });
    
    // Log audit if approval status changed
    if (req.body.approvalStatus) {
      const actionMap: Record<string, 'scan_approved' | 'scan_rejected' | 'scan_pending'> = {
        'approved': 'scan_approved',
        'rejected': 'scan_rejected',
        'pending': 'scan_pending',
      };
      await storage.createAuditLog({
        entityType: 'compliance_scan',
        entityId: scan.id,
        actionType: actionMap[req.body.approvalStatus] || 'scan_pending',
        actorUserId: req.body.approvedBy || 'system',
        actorName: 'System',
        metaJson: { notes: req.body.approvalNotes },
      });
    }
    
    res.json(scan);
  });

  app.delete("/api/compliance/scans/:id", async (req, res) => {
    const scan = await storage.getComplianceScanRun(req.params.id);
    if (!scan) return res.status(404).json({ error: "Scan not found" });
    
    const success = await storage.deleteComplianceScanRun(req.params.id);
    if (!success) return res.status(500).json({ error: "Failed to delete scan" });
    
    // Log audit event for deletion
    await storage.createAuditLog({
      entityType: 'compliance_scan',
      entityId: req.params.id,
      actionType: 'scan_created', // Using existing type, could be extended
      actorUserId: 'system',
      actorName: 'System',
      metaJson: { action: 'deleted', contentType: scan.contentType, contentTitle: scan.contentTitle },
    });
    
    res.json({ success: true });
  });

  app.get("/api/compliance/scans/content/:contentId", async (req, res) => {
    const scans = await storage.getComplianceScanRunsByContentId(req.params.contentId);
    res.json(scans);
  });

  // Compliance Rules
  app.get("/api/compliance/rules", async (_req, res) => {
    const rules = await storage.getComplianceRules();
    res.json(rules);
  });

  app.get("/api/compliance/rules/:id", async (req, res) => {
    const rule = await storage.getComplianceRule(req.params.id);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  });

  app.post("/api/compliance/rules", async (req, res) => {
    try {
      const validatedData = insertComplianceRuleSchema.parse(req.body);
      const rule = await storage.createComplianceRule(validatedData);
      res.status(201).json(rule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create compliance rule" });
    }
  });

  app.put("/api/compliance/rules/:id", async (req, res) => {
    const rule = await storage.updateComplianceRule(req.params.id, req.body);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  });

  app.delete("/api/compliance/rules/:id", async (req, res) => {
    const success = await storage.deleteComplianceRule(req.params.id);
    if (!success) return res.status(404).json({ error: "Rule not found" });
    res.json({ success: true });
  });

  // Compliance Checker Settings
  // Helper function to check if an IP is in a private/reserved range
  function isPrivateOrReservedIP(ip: string): boolean {
    // Normalize IPv4-mapped IPv6 addresses
    const normalized = ip.replace(/^::ffff:/, '');
    
    // Check for IPv4 addresses
    const ipv4Match = normalized.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b, c, d] = ipv4Match.map(Number);
      
      // Loopback (127.0.0.0/8)
      if (a === 127) return true;
      
      // Private ranges
      if (a === 10) return true; // 10.0.0.0/8
      if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
      if (a === 192 && b === 168) return true; // 192.168.0.0/16
      
      // Link-local (169.254.0.0/16) - includes cloud metadata
      if (a === 169 && b === 254) return true;
      
      // Broadcast/Reserved
      if (a === 0) return true; // 0.0.0.0/8
      if (a === 255) return true;
      if (a >= 224 && a <= 239) return true; // Multicast 224.0.0.0/4
      if (a >= 240) return true; // Reserved/experimental
      
      return false;
    }
    
    // Check for IPv6 addresses
    const lowerIp = normalized.toLowerCase();
    if (lowerIp === '::1' || lowerIp === '::') return true; // Loopback and unspecified
    if (lowerIp.startsWith('fc') || lowerIp.startsWith('fd')) return true; // Unique local (ULA)
    if (lowerIp.startsWith('fe80')) return true; // Link-local
    if (lowerIp.startsWith('ff')) return true; // Multicast
    
    return false;
  }

  // URL Scanning endpoint with safe fetch
  app.post("/api/compliance/scan-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Validate URL
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({ error: 'Only HTTP/HTTPS URLs are allowed' });
      }

      // SSRF protection: comprehensive hostname checks
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Block obvious dangerous hostnames
      const blockedHostnames = ['localhost', 'internal', 'intranet', 'metadata', 'metadata.google.internal'];
      if (blockedHostnames.some(blocked => hostname === blocked || hostname.endsWith('.' + blocked))) {
        return res.status(400).json({ error: 'URL not allowed: internal addresses are blocked' });
      }
      
      // Check if hostname looks like an IP address and validate it
      const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const ipv6Pattern = /^\[?([a-f0-9:]+)\]?$/i;
      
      if (ipv4Pattern.test(hostname)) {
        if (isPrivateOrReservedIP(hostname)) {
          return res.status(400).json({ error: 'URL not allowed: private/reserved IP addresses are blocked' });
        }
      } else if (ipv6Pattern.test(hostname)) {
        const ipv6 = hostname.replace(/^\[|\]$/g, '');
        if (isPrivateOrReservedIP(ipv6)) {
          return res.status(400).json({ error: 'URL not allowed: private/reserved IP addresses are blocked' });
        }
      }
      
      // Block numeric IP representations (octal, hex, decimal)
      if (/^0x[0-9a-f]+$/i.test(hostname) || /^0\d+$/.test(hostname) || /^\d{10,}$/.test(hostname)) {
        return res.status(400).json({ error: 'URL not allowed: numeric IP representations are blocked' });
      }

      // Fetch URL with timeout, size cap, and NO redirects (to prevent redirect-based SSRF)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // First request with no redirects to check target
        let response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'BarakaCMS-ComplianceScanner/1.0',
            'Accept': 'text/html, text/plain',
          },
          redirect: 'manual', // Don't follow redirects automatically
        });
        
        // Handle redirects manually with validation (max 5 redirects)
        let redirectCount = 0;
        const maxRedirects = 5;
        let currentUrl = url;
        
        while (response.status >= 300 && response.status < 400 && redirectCount < maxRedirects) {
          const location = response.headers.get('location');
          if (!location) break;
          
          // Resolve relative URLs
          const redirectUrl = new URL(location, currentUrl);
          
          // Validate redirect target
          if (!['http:', 'https:'].includes(redirectUrl.protocol)) {
            return res.status(400).json({ error: 'Redirect blocked: non-HTTP protocol' });
          }
          
          const redirectHostname = redirectUrl.hostname.toLowerCase();
          
          // Re-apply all SSRF checks on redirect target
          if (blockedHostnames.some(blocked => redirectHostname === blocked || redirectHostname.endsWith('.' + blocked))) {
            return res.status(400).json({ error: 'Redirect blocked: internal address' });
          }
          
          if (ipv4Pattern.test(redirectHostname) && isPrivateOrReservedIP(redirectHostname)) {
            return res.status(400).json({ error: 'Redirect blocked: private IP address' });
          }
          
          if (ipv6Pattern.test(redirectHostname)) {
            const ipv6 = redirectHostname.replace(/^\[|\]$/g, '');
            if (isPrivateOrReservedIP(ipv6)) {
              return res.status(400).json({ error: 'Redirect blocked: private IP address' });
            }
          }
          
          currentUrl = redirectUrl.href;
          response = await fetch(currentUrl, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'BarakaCMS-ComplianceScanner/1.0',
              'Accept': 'text/html, text/plain',
            },
            redirect: 'manual',
          });
          redirectCount++;
        }
        
        if (redirectCount >= maxRedirects) {
          return res.status(400).json({ error: 'Too many redirects' });
        }
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          return res.status(400).json({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` });
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
          return res.status(400).json({ error: 'URL must return HTML or plain text content' });
        }

        // Read with size cap (1MB)
        const reader = response.body?.getReader();
        if (!reader) {
          return res.status(400).json({ error: 'Unable to read response body' });
        }

        let html = '';
        const decoder = new TextDecoder();
        const maxSize = 1024 * 1024; // 1MB
        let totalSize = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          totalSize += value?.length || 0;
          if (totalSize > maxSize) {
            reader.cancel();
            break;
          }
          html += decoder.decode(value, { stream: true });
        }

        // Extract text content (strip HTML tags, scripts, styles)
        let textContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

        // Get excerpt (first 600 chars)
        const excerpt = textContent.substring(0, 600);

        // Run compliance scan on extracted text
        const scanResult = await storage.createComplianceScanRun({
          contentType: 'blog',
          contentId: url,
          contentTitle: title,
          originalText: textContent,
          locale: 'en',
          scannedBy: 'url-scanner',
        });

        res.json({
          url,
          title,
          excerpt,
          textLength: textContent.length,
          scan: scanResult,
        });

      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          return res.status(408).json({ error: 'Request timeout: URL took too long to respond' });
        }
        return res.status(400).json({ error: `Failed to fetch URL: ${fetchError.message}` });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to scan URL' });
    }
  });

  // Scan text directly (without creating a full scan record)
  app.post("/api/compliance/scan-text", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Create a quick scan
      const scan = await storage.createComplianceScanRun({
        contentType: 'social',
        contentId: 'text-scan-' + Date.now(),
        contentTitle: 'Text Scan',
        originalText: text,
        locale: 'en',
        scannedBy: 'text-scanner',
      });

      res.json(scan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to scan text' });
    }
  });

  app.get("/api/compliance/settings", async (_req, res) => {
    const settings = await storage.getComplianceCheckerSettings();
    res.json(settings);
  });

  app.put("/api/compliance/settings", async (req, res) => {
    try {
      const settings = await storage.updateComplianceCheckerSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update compliance settings" });
    }
  });

  // Writing Assistant Integrations
  app.get("/api/compliance/writing-assistants", async (_req, res) => {
    const integrations = await storage.getWritingAssistantIntegrations();
    res.json(integrations);
  });

  app.get("/api/compliance/writing-assistants/:id", async (req, res) => {
    const integration = await storage.getWritingAssistantIntegration(req.params.id);
    if (!integration) return res.status(404).json({ error: "Integration not found" });
    res.json(integration);
  });

  app.post("/api/compliance/writing-assistants", async (req, res) => {
    try {
      const integration = await storage.createWritingAssistantIntegration(req.body);
      res.status(201).json(integration);
    } catch (error) {
      res.status(500).json({ error: "Failed to create writing assistant integration" });
    }
  });

  app.put("/api/compliance/writing-assistants/:id", async (req, res) => {
    const integration = await storage.updateWritingAssistantIntegration(req.params.id, req.body);
    if (!integration) return res.status(404).json({ error: "Integration not found" });
    res.json(integration);
  });

  app.delete("/api/compliance/writing-assistants/:id", async (req, res) => {
    const success = await storage.deleteWritingAssistantIntegration(req.params.id);
    if (!success) return res.status(404).json({ error: "Integration not found" });
    res.json({ success: true });
  });

  // English Quality Analysis (via OpenAI or Writing Assistant)
  app.post("/api/compliance/analyze-english", async (req, res) => {
    try {
      const { scanId, text } = req.body;
      const settings = await storage.getComplianceCheckerSettings();
      
      if (!settings.enableEnglishQualityScoring) {
        return res.status(400).json({ error: "English quality scoring is not enabled" });
      }
      
      let englishScore = null;
      let englishFindings: any[] = [];
      let englishSuggestedEdits: any[] = [];
      let englishLabel: 'excellent' | 'good' | 'needs_edits' | 'not_configured' = 'not_configured';
      let provider: 'writing_assistant' | 'openai' | 'fallback' = 'fallback';
      
      if (settings.englishScoringProvider === 'writing_assistant') {
        const integration = await storage.getActiveWritingAssistantIntegration();
        if (integration) {
          try {
            const response = await fetch(`${integration.baseUrl}${integration.analyzePath}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...integration.headers,
              },
              body: JSON.stringify({ text, language: 'en' }),
            });
            const data = await response.json();
            englishScore = Math.min(100, Math.max(0, data.score || 0));
            englishFindings = data.issues || [];
            englishSuggestedEdits = data.edits || [];
            provider = 'writing_assistant';
          } catch (e) {
            console.error('Writing assistant error:', e);
          }
        }
      } else if (settings.englishScoringProvider === 'openai') {
        // OpenAI integration will be handled client-side or via a separate endpoint
        // For now, use fallback rules-based lint
        const issues = runBasicEnglishLint(text);
        englishFindings = issues;
        englishScore = Math.max(0, 100 - issues.length * 5);
        provider = 'fallback';
      }
      
      // Calculate label
      if (englishScore !== null) {
        if (englishScore >= settings.englishThresholds.excellent) {
          englishLabel = 'excellent';
        } else if (englishScore >= settings.englishThresholds.good) {
          englishLabel = 'good';
        } else {
          englishLabel = 'needs_edits';
        }
      }
      
      // Update scan run if scanId provided
      if (scanId) {
        await storage.updateComplianceScanRun(scanId, {
          englishScore,
          englishLabel,
          englishFindings,
          englishSuggestedEdits,
          englishProvider: provider,
        });
        
        // Log audit
        await storage.createAuditLog({
          entityType: 'compliance_scan',
          entityId: scanId,
          actionType: 'english_analysis_run',
          actorUserId: 'system',
          actorName: 'System',
          metaJson: { provider, score: englishScore },
        });
      }
      
      res.json({
        englishScore,
        englishLabel,
        englishFindings,
        englishSuggestedEdits,
        provider,
      });
    } catch (error) {
      console.error('English analysis error:', error);
      res.status(500).json({ error: "Failed to analyze English quality" });
    }
  });

  // Apply English edits
  app.post("/api/compliance/apply-english-edits", async (req, res) => {
    try {
      const { scanId, text, edits } = req.body;
      
      // Apply edits in reverse order to maintain offsets
      let result = text;
      const sortedEdits = [...edits].sort((a: any, b: any) => b.start - a.start);
      
      for (const edit of sortedEdits) {
        result = result.substring(0, edit.start) + edit.replacement + result.substring(edit.end);
      }
      
      // Log audit
      if (scanId) {
        await storage.createAuditLog({
          entityType: 'compliance_scan',
          entityId: scanId,
          actionType: 'english_edits_applied',
          actorUserId: 'system',
          actorName: 'System',
          metaJson: { editCount: edits.length },
        });
      }
      
      res.json({ success: true, text: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to apply edits" });
    }
  });

  // ============================================
  // PUBLIC ENDPOINTS (No Auth Required)
  // ============================================

  // Get active spotlights by locale and placement
  app.get("/api/public/spotlights", async (req, res) => {
    const locale = req.query.locale as string | undefined;
    const placement = req.query.placement as string | undefined;
    
    let spotlights = await storage.getActiveSpotlights(placement);
    
    if (locale) {
      spotlights = spotlights.filter(s => s.locale === locale);
    }
    
    res.json(spotlights);
  });

  // Get sent newsletters list
  app.get("/api/public/newsletters", async (req, res) => {
    let newsletters = await storage.getNewsletters();
    
    // Only return sent newsletters
    newsletters = newsletters.filter(n => n.status === 'sent');
    
    const locale = req.query.locale as string | undefined;
    if (locale) {
      newsletters = newsletters.filter(n => n.locale === locale);
    }
    
    // Return limited fields for public consumption
    const publicNewsletters = newsletters.map(n => ({
      id: n.id,
      subject: n.subject,
      preheader: n.preheader,
      locale: n.locale,
      sentAt: n.sentAt,
    }));
    
    res.json(publicNewsletters);
  });

  // Get newsletter HTML output
  app.get("/api/public/newsletters/:id", async (req, res) => {
    const newsletter = await storage.getNewsletter(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    // Only return sent newsletters publicly
    if (newsletter.status !== 'sent') {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    res.json({
      id: newsletter.id,
      subject: newsletter.subject,
      preheader: newsletter.preheader,
      htmlOutput: newsletter.htmlOutput,
      locale: newsletter.locale,
      sentAt: newsletter.sentAt,
    });
  });

  const httpServer = createServer(app);

  // ============================================
  // WebSocket Server for Real-Time Presence
  // ============================================

  const wss = new WebSocketServer({ server: httpServer, path: '/ws/presence' });

  // Cleanup stale presences every 15 seconds
  setInterval(cleanupStalePresences, 15000);

  wss.on('connection', (ws) => {
    let presenceId: string | null = null;

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString()) as PresenceMessage;
        const now = Date.now();

        switch (message.type) {
          case 'join':
            if (message.presence) {
              presenceId = nanoid();
              // Use client-provided color if available, otherwise assign from palette
              const userColor = message.presence.userColor || PRESENCE_COLORS[activePresences.size % PRESENCE_COLORS.length];
              const presence: UserPresence = {
                ...message.presence,
                id: presenceId,
                userColor,
                lastActive: now,
              };
              activePresences.set(presenceId, presence);
              wsClients.set(ws, presenceId);

              // Send sync to new client with their assigned ID
              ws.send(JSON.stringify({
                type: 'sync',
                presence, // Include the user's own presence with assigned ID
                presences: Array.from(activePresences.values()),
                timestamp: now,
              } as PresenceMessage));

              // Broadcast join to others
              broadcastPresence({
                type: 'join',
                presence,
                timestamp: now,
              }, ws);
            }
            break;

          case 'update':
            if (presenceId && message.presence) {
              const existing = activePresences.get(presenceId);
              if (existing) {
                const updated: UserPresence = {
                  ...existing,
                  ...message.presence,
                  id: presenceId,
                  lastActive: now,
                };
                activePresences.set(presenceId, updated);
                broadcastPresence({
                  type: 'update',
                  presence: updated,
                  timestamp: now,
                });
              }
            }
            break;

          case 'heartbeat':
            if (presenceId) {
              const existing = activePresences.get(presenceId);
              if (existing) {
                existing.lastActive = now;
                activePresences.set(presenceId, existing);
                // Send back acknowledgement with current presences
                ws.send(JSON.stringify({
                  type: 'sync',
                  presences: Array.from(activePresences.values()),
                  timestamp: now,
                } as PresenceMessage));
              }
            }
            break;

          case 'leave':
            if (presenceId) {
              const presence = activePresences.get(presenceId);
              if (presence) {
                activePresences.delete(presenceId);
                broadcastPresence({
                  type: 'leave',
                  presence,
                  timestamp: now,
                });
              }
              wsClients.delete(ws);
              presenceId = null;
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (presenceId) {
        const presence = activePresences.get(presenceId);
        if (presence) {
          activePresences.delete(presenceId);
          broadcastPresence({
            type: 'leave',
            presence,
            timestamp: Date.now(),
          });
        }
        wsClients.delete(ws);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
