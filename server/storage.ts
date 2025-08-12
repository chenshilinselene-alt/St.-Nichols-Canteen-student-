import { type User, type InsertUser, type FoodStall, type InsertFoodStall, type MenuItem, type InsertMenuItem, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFoodStalls(): Promise<FoodStall[]>;
  getFoodStall(id: string): Promise<FoodStall | undefined>;
  createFoodStall(stall: InsertFoodStall): Promise<FoodStall>;
  
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByStall(stallId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private foodStalls: Map<string, FoodStall>;
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.foodStalls = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    
    // Initialize with food stalls and menu items
    this.initializeData();
  }

  private initializeData() {
    // Initialize food stalls
    const stalls: FoodStall[] = [
      {
        id: "auntie-jenny",
        name: "Auntie Jenny",
        description: "Delicious Economy Rice!",
        emoji: "👩‍🍳",
        available: 1
      },
      {
        id: "uncle-lim",
        name: "Uncle Mobeen",
        description: "Tons of drinks to choose from!",
        emoji: "👨‍🍳",
        available: 1
      }
    ];

    stalls.forEach(stall => {
      this.foodStalls.set(stall.id, stall);
    });

    // Initialize Auntie Jenny's menu items
    const items: MenuItem[] = [
      {
        id: "rice",
        stallId: "auntie-jenny",
        name: "Rice",
        description: "Steamed white rice",
        basePrice: "1.00",
        emoji: "🍚",
        imageUrl: "/attached_assets/IMG_0583_1754750988726.jpeg",
        available: 1,
        hasPortionModifiers: 1,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "tomato-egg-stir-fry",
        stallId: "auntie-jenny",
        name: "Tomato-Egg Stir Fry",
        description: "Fresh tomatoes with fluffy eggs",
        basePrice: "0.50",
        emoji: "🍅",
        imageUrl: "/attached_assets/IMG_0582_1754754762269.jpeg",
        available: 1,
        hasPortionModifiers: 1,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "prawn-dumplings",
        stallId: "auntie-jenny",
        name: "Grilled Chinese Chives and Prawn Dumplings",
        description: "Handmade dumplings with fresh prawns",
        basePrice: "0.70",
        emoji: "🥟",
        imageUrl: "/attached_assets/IMG_0585_1754755325943.jpeg",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 1,
        quantityOptions: [
          { quantity: "1 piece", price: "0.70" },
          { quantity: "3 pieces", price: "2.00" }
        ],
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "bean-sprouts",
        stallId: "auntie-jenny",
        name: "Bean Sprout and Carrot Stir Fry",
        description: "Crispy fresh bean sprouts stir-fried",
        basePrice: "0.40",
        emoji: "🌱",
        imageUrl: "/attached_assets/IMG_8411_1754759070966.jpeg",
        available: 1,
        hasPortionModifiers: 1,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "water-spinach",
        stallId: "auntie-jenny",
        name: "Water Spinach",
        description: "Fresh water spinach with garlic",
        basePrice: "0.40",
        emoji: "🥬",
        imageUrl: "/attached_assets/IMG_0619_1754759191475.jpeg",
        available: 1,
        hasPortionModifiers: 1,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 1,
        hasGarlic: 1
      },
      {
        id: "minced-meat",
        stallId: "auntie-jenny",
        name: "Minced Meat",
        description: "Savory minced meat stir fry",
        basePrice: "0.70",
        emoji: "🍖",
        imageUrl: "/attached_assets/IMG_0622_1754925227704.webp",
        available: 1,
        hasPortionModifiers: 1,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      // Uncle Mobeen's drinks
      {
        id: "iced-lemon-tea",
        stallId: "uncle-lim",
        name: "Iced Lemon Tea",
        description: "Refreshing iced tea with fresh lemon",
        basePrice: "1.80",
        emoji: "🍋",
        imageUrl: "/attached_assets/IMG_0626_1755001426391.jpeg",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "ice-blended-matcha-latte",
        stallId: "uncle-lim",
        name: "Ice Blended Matcha Latte",
        description: "Creamy matcha latte blended with ice",
        basePrice: "3.20",
        emoji: "🍵",
        imageUrl: "/attached_assets/IMG_0627_1755001426392.webp",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "iced-coffee",
        stallId: "uncle-lim",
        name: "Iced Coffee",
        description: "Classic cold brew coffee over ice",
        basePrice: "2.50",
        emoji: "☕",
        imageUrl: "/attached_assets/IMG_0633_1755001999857.jpeg",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "mango-smoothie",
        stallId: "uncle-lim",
        name: "Fresh Mango Smoothie",
        description: "Tropical mango blended with yogurt",
        basePrice: "3.80",
        emoji: "🥭",
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=150&h=150&fit=crop&crop=center",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "strawberry-lemonade",
        stallId: "uncle-lim",
        name: "Strawberry Lemonade",
        description: "Fresh strawberries with tangy lemonade",
        basePrice: "2.80",
        emoji: "🍓",
        imageUrl: "/attached_assets/IMG_0634_1755001999857.jpeg",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      },
      {
        id: "chocolate-milkshake",
        stallId: "uncle-lim",
        name: "Chocolate Milkshake",
        description: "Rich chocolate shake with whipped cream",
        basePrice: "4.50",
        emoji: "🍫",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=150&h=150&fit=crop&crop=center",
        available: 1,
        hasPortionModifiers: 0,
        hasQuantityOptions: 0,
        quantityOptions: null,
        isSpicy: 0,
        hasGarlic: 0
      }
    ];

    items.forEach(item => {
      this.menuItems.set(item.id, item);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFoodStalls(): Promise<FoodStall[]> {
    return Array.from(this.foodStalls.values());
  }

  async getFoodStall(id: string): Promise<FoodStall | undefined> {
    return this.foodStalls.get(id);
  }

  async createFoodStall(insertStall: InsertFoodStall): Promise<FoodStall> {
    const id = randomUUID();
    const stall: FoodStall = { 
      ...insertStall, 
      id,
      available: insertStall.available ?? 1
    };
    this.foodStalls.set(id, stall);
    return stall;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByStall(stallId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.stallId === stallId);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { 
      ...insertItem, 
      id,
      available: insertItem.available ?? 1,
      hasPortionModifiers: insertItem.hasPortionModifiers ?? 0,
      hasQuantityOptions: insertItem.hasQuantityOptions ?? 0,
      quantityOptions: insertItem.quantityOptions ?? null,
      isSpicy: insertItem.isSpicy ?? 0,
      hasGarlic: insertItem.hasGarlic ?? 0,
      imageUrl: insertItem.imageUrl ?? null
    };
    this.menuItems.set(id, item);
    return item;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      studentClass: insertOrder.studentClass ?? null,
      status: insertOrder.status ?? "pending",
      paymentMethod: insertOrder.paymentMethod ?? "paylah",
      servingPreference: insertOrder.servingPreference ?? "combined",
      diningOption: insertOrder.diningOption ?? "dine-in",
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

export const storage = new MemStorage();
