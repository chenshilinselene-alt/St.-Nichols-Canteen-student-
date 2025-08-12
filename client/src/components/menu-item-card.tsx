import { MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-kawaii hover:shadow-kawaii-hover transition-all duration-300 hover-float" data-testid={`card-menu-item-${item.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={item.imageUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
            alt={item.description}
            className="w-16 h-16 object-cover rounded-kawaii shadow-md"
            data-testid={`img-${item.id}`}
          />
          <div className="flex-1">
            <h4 className="font-cute font-semibold text-gray-800" data-testid={`text-name-${item.id}`}>
              {item.name}
            </h4>
            <p className="text-sm text-gray-600 mb-2" data-testid={`text-description-${item.id}`}>
              {item.description}
            </p>
            {(item.isSpicy || item.hasGarlic) && (
              <div className="flex gap-2 mb-2">
                {item.isSpicy && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-xs rounded-full border border-red-200" style={{ color: '#D1555B' }}>
                    🌶️
                    Mildly Spicy
                  </span>
                )}
                {item.hasGarlic && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-gray-700 text-xs rounded-full border border-green-200">
                    🧄
                    Contains Garlic
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-kawaii-pink" data-testid={`text-price-${item.id}`}>
                ${parseFloat(item.basePrice).toFixed(2)}
                {item.hasPortionModifiers ? "*" : ""}
                {item.quantityOptions ? " (varies)" : ""}
              </span>
              <Button
                onClick={() => onAddToCart(item)}
                className="bg-gradient-to-r from-kawaii-lavender to-kawaii-pink hover:from-kawaii-pink hover:to-kawaii-lavender text-white px-4 py-2 rounded-kawaii text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                data-testid={`button-add-to-cart-${item.id}`}
              >
                Add to Cart 💖
              </Button>
            </div>
            {(item.hasPortionModifiers || item.quantityOptions) && (
              <p className="text-xs text-gray-500 mt-1">
                {item.hasPortionModifiers ? "* Portion sizes available" : ""}
                {item.hasPortionModifiers && item.quantityOptions ? " • " : ""}
                {item.quantityOptions ? "Multiple quantities available" : ""}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
