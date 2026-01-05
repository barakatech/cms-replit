import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertPriceAlertSubscriptionSchema, insertStockWatchSubscriptionSchema, insertNewsletterSignupSchema, insertCallToActionSchema, insertCTAEventSchema } from "@shared/schema";
import type { InsertCmsWebEvent, InsertBannerEvent, UserPresence, PresenceMessage } from "@shared/schema";
import { PRESENCE_COLORS } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

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
