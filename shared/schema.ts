import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const foodStalls = pgTable("food_stalls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  available: integer("available").default(1).notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stallId: varchar("stall_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  emoji: text("emoji").notNull(),
  imageUrl: text("image_url"),
  available: integer("available").default(1).notNull(),
  hasPortionModifiers: integer("has_portion_modifiers").default(0).notNull(),
  hasQuantityOptions: integer("has_quantity_options").default(0).notNull(),
  quantityOptions: jsonb("quantity_options"),
  isSpicy: integer("is_spicy").default(0).notNull(),
  hasGarlic: integer("has_garlic").default(0).notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuItemId: varchar("menu_item_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  selectedPortion: text("selected_portion").default("normal"),
  selectedQuantity: text("selected_quantity"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  servingPreference: text("serving_preference").default("combined"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  studentClass: text("student_class"),
  pickupTime: text("pickup_time").notNull(),
  items: jsonb("items").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(),
  paymentMethod: text("payment_method").default("paylah").notNull(),
  servingPreference: text("serving_preference").default("combined"),
  diningOption: text("dining_option").default("dine-in").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFoodStallSchema = createInsertSchema(foodStalls).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FoodStall = typeof foodStalls.$inferSelect;
export type InsertFoodStall = z.infer<typeof insertFoodStallSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
