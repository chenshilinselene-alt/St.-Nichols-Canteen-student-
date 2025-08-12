import { MenuItem } from "@shared/schema";

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  selectedPortion: 'less' | 'normal' | 'more';
  selectedQuantity?: string;
  finalPrice: number;
  servingPreference?: 'combined' | 'separate';
}

class CartStore {
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Load cart from localStorage
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('auntie-jenny-cart');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auntie-jenny-cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  private calculatePrice(menuItem: MenuItem, portion: string, quantity?: string): number {
    let basePrice = parseFloat(menuItem.basePrice);
    
    // Apply quantity pricing if available
    if (quantity && menuItem.quantityOptions) {
      const quantityOption = (menuItem.quantityOptions as any[]).find(opt => opt.quantity === quantity);
      if (quantityOption) {
        basePrice = parseFloat(quantityOption.price);
      }
    }
    
    // Portion modifiers don't affect price (school policy)
    // Students can get more or less portions at the same price
    
    return basePrice;
  }

  addItem(menuItem: MenuItem, portion: 'less' | 'normal' | 'more' = 'normal', quantity?: string) {
    const finalPrice = this.calculatePrice(menuItem, portion, quantity);
    
    const cartItem: CartItem = {
      cartId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      menuItem,
      selectedPortion: portion,
      selectedQuantity: quantity,
      finalPrice,
    };
    
    this.items.push(cartItem);
    this.saveToStorage();
    this.notify();
  }

  removeItem(cartId: string) {
    this.items = this.items.filter(item => item.cartId !== cartId);
    this.saveToStorage();
    this.notify();
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.finalPrice, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasRiceAndDumplings(): boolean {
    const hasRice = this.items.some(item => item.menuItem.id === 'rice');
    const hasDumplings = this.items.some(item => item.menuItem.id === 'prawn-dumplings');
    return hasRice && hasDumplings;
  }

  setServingPreference(preference: 'combined' | 'separate') {
    this.items.forEach(item => {
      if (item.menuItem.id === 'rice' || item.menuItem.id === 'prawn-dumplings') {
        item.servingPreference = preference;
      }
    });
    this.saveToStorage();
    this.notify();
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const cartStore = new CartStore();
