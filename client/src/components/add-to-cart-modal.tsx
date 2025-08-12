import { useState } from "react";
import { MenuItem } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Equal } from "lucide-react";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToCart: (item: MenuItem, portion: 'less' | 'normal' | 'more', quantity?: string) => void;
}

export default function AddToCartModal({ isOpen, onClose, menuItem, onAddToCart }: AddToCartModalProps) {
  const [selectedPortion, setSelectedPortion] = useState<'less' | 'normal' | 'more'>('normal');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');

  if (!menuItem) return null;

  const handleAddToCart = () => {
    onAddToCart(menuItem, selectedPortion, selectedQuantity || undefined);
    onClose();
    setSelectedPortion('normal');
    setSelectedQuantity('');
  };

  const calculatePrice = () => {
    let basePrice = parseFloat(menuItem.basePrice);
    
    // Apply quantity pricing if available
    if (selectedQuantity && menuItem.quantityOptions) {
      const quantityOption = (menuItem.quantityOptions as any[]).find(opt => opt.quantity === selectedQuantity);
      if (quantityOption) {
        basePrice = parseFloat(quantityOption.price);
      }
    }
    
    // Portion modifiers don't affect price (school policy)
    // Students can get more or less portions at the same price
    
    return basePrice;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-super" data-testid="modal-add-to-cart">
        <DialogHeader>
          <DialogTitle className="font-cute font-bold text-xl text-gray-800 flex items-center">
            <span className="text-2xl mr-3">{menuItem.emoji}</span>
            {menuItem.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <img 
              src={menuItem.imageUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
              alt={menuItem.description}
              className="w-24 h-24 object-cover rounded-kawaii shadow-md mx-auto mb-3"
            />
            <p className="text-sm text-gray-600">{menuItem.description}</p>
          </div>

          {/* Quantity Options */}
          {menuItem.hasQuantityOptions && menuItem.quantityOptions && (
            <div className="space-y-3">
              <Label className="font-cute font-semibold text-gray-800">Quantity</Label>
              <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                <SelectTrigger className="border-kawaii-pink/30 focus:border-kawaii-pink rounded-kawaii" data-testid="select-quantity">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {(menuItem.quantityOptions as any[]).map((option) => (
                    <SelectItem key={option.quantity} value={option.quantity}>
                      {option.quantity} - ${parseFloat(option.price).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Portion Modifiers */}
          {menuItem.hasPortionModifiers && (
            <div className="space-y-3">
              <Label className="font-cute font-semibold text-gray-800">Portion Size</Label>
              <p className="text-xs text-gray-500 mb-2">All portion sizes are the same price!</p>
              <RadioGroup 
                value={selectedPortion} 
                onValueChange={(value) => setSelectedPortion(value as 'less' | 'normal' | 'more')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 rounded-kawaii border border-kawaii-pink/20 hover:bg-kawaii-cream/50 transition-colors">
                  <RadioGroupItem value="less" id="less" />
                  <Label htmlFor="less" className="flex-1 cursor-pointer flex items-center">
                    <Minus className="w-4 h-4 text-kawaii-pink mr-2" />
                    <span>Less portion</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-kawaii border border-kawaii-pink/20 hover:bg-kawaii-cream/50 transition-colors">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="flex-1 cursor-pointer flex items-center">
                    <Equal className="w-4 h-4 text-kawaii-mint mr-2" />
                    <span>Normal portion</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-kawaii border border-kawaii-pink/20 hover:bg-kawaii-cream/50 transition-colors">
                  <RadioGroupItem value="more" id="more" />
                  <Label htmlFor="more" className="flex-1 cursor-pointer flex items-center">
                    <Plus className="w-4 h-4 text-kawaii-lavender mr-2" />
                    <span>More portion</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Price Display */}
          <div className="bg-kawaii-cream/50 rounded-kawaii p-4 text-center">
            <p className="font-cute font-bold text-2xl text-kawaii-pink" data-testid="text-calculated-price">
              ${calculatePrice().toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-100"
              onClick={onClose}
              data-testid="button-cancel-add"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-kawaii-pink to-kawaii-peach hover:from-kawaii-peach hover:to-kawaii-pink text-white font-cute font-semibold rounded-kawaii"
              onClick={handleAddToCart}
              data-testid="button-confirm-add"
            >
              Add to Cart 💖
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}