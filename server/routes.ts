import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all food stalls
  app.get("/api/stalls", async (req, res) => {
    try {
      const stalls = await storage.getFoodStalls();
      res.json(stalls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food stalls" });
    }
  });

  // Get menu items by stall
  app.get("/api/stalls/:stallId/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItemsByStall(req.params.stallId);
      // Convert numeric boolean fields to proper booleans
      const processedItems = items.map(item => ({
        ...item,
        available: Boolean(item.available),
        hasPortionModifiers: Boolean(item.hasPortionModifiers),
        hasQuantityOptions: Boolean(item.hasQuantityOptions),
        isSpicy: Boolean(item.isSpicy),
        hasGarlic: Boolean(item.hasGarlic)
      }));
      res.json(processedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get all menu items
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      // Convert numeric boolean fields to proper booleans
      const processedItems = items.map(item => ({
        ...item,
        available: Boolean(item.available),
        hasPortionModifiers: Boolean(item.hasPortionModifiers),
        hasQuantityOptions: Boolean(item.hasQuantityOptions),
        isSpicy: Boolean(item.isSpicy),
        hasGarlic: Boolean(item.hasGarlic)
      }));
      res.json(processedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get specific menu item
  app.get("/api/menu/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      // Convert numeric boolean fields to proper booleans
      const processedItem = {
        ...item,
        available: Boolean(item.available),
        hasPortionModifiers: Boolean(item.hasPortionModifiers),
        hasQuantityOptions: Boolean(item.hasQuantityOptions),
        isSpicy: Boolean(item.isSpicy),
        hasGarlic: Boolean(item.hasGarlic)
      };
      res.json(processedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  // Create order with PayLah simulation
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Simulate PayLah payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const order = await storage.createOrder(orderData);
      
      res.json({
        success: true,
        order,
        paymentStatus: "completed",
        transactionId: `PL${Math.floor(Math.random() * 1000000)}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to process order" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Mock PayLah payment verification
  app.post("/api/payment/verify", async (req, res) => {
    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        res.json({
          success: true,
          status: "verified",
          transactionId: `PL${Math.floor(Math.random() * 1000000)}`,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          success: false,
          status: "failed",
          message: "Payment verification failed"
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Payment verification error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
