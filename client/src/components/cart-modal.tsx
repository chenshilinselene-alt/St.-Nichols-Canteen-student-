import { useState, useEffect } from "react";
import { cartStore } from "@/lib/cart-store";
import type { CartItem } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, HeartCrack } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(cartStore.getItems());
      setCartTotal(cartStore.getTotal());
    };

    updateCart();
    const unsubscribe = cartStore.subscribe(updateCart);
    return unsubscribe;
  }, []);

  const handleRemoveItem = (cartId: string) => {
    cartStore.removeItem(cartId);
  };

  const handleCheckout = () => {
    onClose();
    onCheckout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto bg-white rounded-super" data-testid="modal-cart">
        <DialogHeader>
          <DialogTitle className="font-cute font-bold text-xl text-gray-800 flex items-center">
            <ShoppingCart className="w-5 h-5 text-kawaii-pink mr-2" />
            Your Cart 🛒
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mb-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="empty-cart">
              <HeartCrack className="w-12 h-12 text-kawaii-pink mx-auto mb-4" />
              <p className="font-cute">Your cart is empty! Add some yummy food! 🥺</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.cartId} 
                className="flex items-center justify-between bg-kawaii-cream rounded-kawaii p-3"
                data-testid={`cart-item-${item.cartId}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.menuItem.emoji}</span>
                  <div>
                    <h4 className="font-medium text-sm" data-testid={`cart-item-name-${item.cartId}`}>
                      {item.menuItem.name}
                    </h4>
                    <div className="text-xs text-gray-600">
                      <p data-testid={`cart-item-price-${item.cartId}`}>
                        ${item.finalPrice.toFixed(2)}
                      </p>
                      {item.selectedPortion !== 'normal' && (
                        <p className="text-kawaii-pink">Portion: {item.selectedPortion}</p>
                      )}
                      {item.selectedQuantity && (
                        <p className="text-kawaii-mint">{item.selectedQuantity}</p>
                      )}
                      {item.servingPreference === 'separate' && (
                        <p className="text-kawaii-lavender">Served separately</p>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.cartId)}
                  className="text-red-400 hover:text-red-600 p-1"
                  data-testid={`button-remove-${item.cartId}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <Separator className="bg-kawaii-pink/30" />
            <div className="flex justify-between items-center mb-4 pt-4">
              <span className="font-cute font-semibold text-lg">Total:</span>
              <span className="font-bold text-xl text-kawaii-pink" data-testid="text-cart-total">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-kawaii-pink to-kawaii-peach text-white font-cute font-semibold py-3 rounded-kawaii shadow-kawaii hover:shadow-kawaii-hover transition-all duration-300"
              data-testid="button-proceed-checkout"
            >
              Proceed to Checkout 🌸✨
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
