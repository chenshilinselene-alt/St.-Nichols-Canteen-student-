import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FoodStall } from "@shared/schema";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Store } from "lucide-react";

interface StallSidebarProps {
  selectedStall: string | null;
  onStallSelect: (stallId: string) => void;
}

export default function StallSidebar({ selectedStall, onStallSelect }: StallSidebarProps) {
  const [open, setOpen] = useState(false);

  const { data: stalls = [], isLoading } = useQuery<FoodStall[]>({
    queryKey: ["/api/stalls"],
  });

  const handleStallSelect = (stallId: string) => {
    onStallSelect(stallId);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          data-testid="button-stalls-menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-gradient-to-b from-kawaii-cream to-kawaii-mint">
        <SheetHeader>
          <SheetTitle className="font-cute font-bold text-xl text-gray-800 flex items-center">
            <Store className="w-5 h-5 text-kawaii-pink mr-2" />
            Food Stalls 🏪
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="kawaii-pulse">
                <Store className="w-12 h-12 text-kawaii-pink mx-auto mb-4" />
              </div>
              <p className="font-cute text-gray-600">Loading stalls...</p>
            </div>
          ) : (
            <>
              {stalls.map((stall) => (
                <div
                  key={stall.id}
                  className={`
                    p-4 rounded-kawaii cursor-pointer transition-all duration-300 hover-float
                    ${selectedStall === stall.id 
                      ? 'bg-kawaii-pink text-white shadow-kawaii-hover' 
                      : 'bg-white/90 backdrop-blur-sm shadow-kawaii hover:shadow-kawaii-hover'
                    }
                  `}
                  onClick={() => handleStallSelect(stall.id)}
                  data-testid={`stall-${stall.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{stall.emoji}</span>
                    <div className="flex-1">
                      <h3 className={`font-cute font-semibold ${selectedStall === stall.id ? 'text-white' : 'text-gray-800'}`}>
                        {stall.name}
                      </h3>
                      <p className={`text-sm ${selectedStall === stall.id ? 'text-white/80' : 'text-gray-600'}`}>
                        {stall.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* More stalls coming soon message */}
              <div className="p-4 rounded-kawaii bg-white/60 backdrop-blur-sm shadow-kawaii border-2 border-dashed border-kawaii-lavender">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">🚧</span>
                  <h3 className="font-cute font-semibold text-gray-600 mb-1">
                    More stalls coming soon!
                  </h3>
                  <p className="text-xs text-gray-500">
                    Stay tuned for more delicious options 🍴
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cute decorative elements */}
        <div className="absolute bottom-4 left-4 text-4xl kawaii-bounce opacity-50" style={{ animationDelay: '0.5s' }}>
          🍱
        </div>
        <div className="absolute top-20 right-4 text-3xl kawaii-bounce opacity-50" style={{ animationDelay: '1s' }}>
          🥟
        </div>
        <div className="absolute bottom-16 right-8 text-2xl kawaii-bounce opacity-50" style={{ animationDelay: '1.5s' }}>
          🍜
        </div>
      </SheetContent>
    </Sheet>
  );
}