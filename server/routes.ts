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

  const httpServer = createServer(app);
  return httpServer;
}
