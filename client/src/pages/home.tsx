import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MenuItem } from "@shared/schema";
import { cartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import MenuItemCard from "@/components/menu-item-card";
import CartModal from "@/components/cart-modal";
import StallSidebar from "@/components/stall-sidebar";
import AddToCartModal from "@/components/add-to-cart-modal";
import ServingPreferenceModal from "@/components/serving-preference-modal";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedStall, setSelectedStall] = useState<string | null>("auntie-jenny");
  const [addToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [servingPreferenceModalOpen, setServingPreferenceModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: selectedStall ? ["/api/stalls", selectedStall, "menu"] : ["/api/menu"],
    enabled: !!selectedStall,
  });

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartStore.getCount());
    };

    updateCartCount();
    const unsubscribe = cartStore.subscribe(updateCartCount);
    return unsubscribe;
  }, []);

  const handleOpenAddToCart = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setAddToCartModalOpen(true);
  };

  const handleAddToCart = (item: MenuItem, portion: 'less' | 'normal' | 'more', quantity?: string) => {
    cartStore.addItem(item, portion, quantity);
    
    // Check if both rice and dumplings are now in cart
    if (cartStore.hasRiceAndDumplings()) {
      setServingPreferenceModalOpen(true);
    }
    
    toast({
      title: `${item.emoji} ${item.name} added to cart!`,
      description: "Your delicious meal is waiting for you!",
      className: "bg-kawaii-pink border-kawaii-peach text-white",
    });
  };

  const handleServingPreference = (preference: 'combined' | 'separate') => {
    cartStore.setServingPreference(preference);
    toast({
      title: `Serving preference set!`,
      description: `Your rice and dumplings will be served ${preference}.`,
      className: "bg-kawaii-mint border-kawaii-blue text-white",
    });
  };

  const handleCheckout = () => {
    if (cartStore.getCount() > 0) {
      setLocation("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kawaii-cream via-kawaii-blue to-kawaii-mint flex items-center justify-center">
        <div className="text-center">
          <div className="kawaii-pulse mb-4">
            <Heart className="w-12 h-12 text-kawaii-pink mx-auto" />
          </div>
          <p className="font-cute text-lg text-gray-700">Loading delicious food... 🌸</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-cream via-kawaii-blue to-kawaii-mint">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-kawaii sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StallSidebar 
                selectedStall={selectedStall}
                onStallSelect={setSelectedStall}
              />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-kawaii-pink to-kawaii-peach rounded-kawaii flex items-center justify-center kawaii-bounce">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-cute font-bold text-xl text-gray-800">School Canteen</h1>
              </div>
            </div>
            <div className="relative">
              <Button
                onClick={() => setCartOpen(true)}
                className="bg-kawaii-pink hover:bg-kawaii-peach p-3 rounded-kawaii shadow-kawaii hover:shadow-kawaii-hover transition-all duration-300 hover-float"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-kawaii-lavender text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center" data-testid="text-cart-count">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Welcome Section */}
        <section className="py-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-super p-6 shadow-kawaii mb-6 relative">
            <div className="text-center">
              <h2 className="font-cute font-bold text-2xl text-gray-800 mb-2">Welcome! 🌸</h2>
              <p className="text-gray-600 font-medium">Choose a food stall and order your favorite school meals!</p>
            </div>
            {/* Cute food illustrations */}
            <div className="absolute -top-4 -right-4 text-4xl kawaii-bounce" style={{ animationDelay: '0.5s' }}>🍱</div>
            <div className="absolute -bottom-2 -left-2 text-3xl kawaii-bounce" style={{ animationDelay: '1s' }}>🥟</div>
          </div>
        </section>

        {/* Current Stall Section */}
        {selectedStall && (
          <section>
            <h3 className="font-cute font-bold text-xl text-gray-800 mb-4 flex items-center">
              <span className="text-kawaii-pink mr-2">👩‍🍳</span>
              {selectedStall === "auntie-jenny" ? "Auntie Jenny's Menu" : "Menu"}
            </h3>

            <div className="space-y-4">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleOpenAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {!selectedStall && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="font-cute font-bold text-xl text-gray-800 mb-2">Choose a Food Stall</h3>
            <p className="text-gray-600">Open the menu to select a food stall and start ordering!</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
      
      <AddToCartModal
        isOpen={addToCartModalOpen}
        onClose={() => setAddToCartModalOpen(false)}
        menuItem={selectedMenuItem}
        onAddToCart={handleAddToCart}
      />
      
      <ServingPreferenceModal
        isOpen={servingPreferenceModalOpen}
        onClose={() => setServingPreferenceModalOpen(false)}
        onConfirm={handleServingPreference}
      />
    </div>
  );
}
