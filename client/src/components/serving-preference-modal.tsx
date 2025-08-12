import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Utensils, Package } from "lucide-react";

interface ServingPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (preference: 'combined' | 'separate') => void;
}

export default function ServingPreferenceModal({ isOpen, onClose, onConfirm }: ServingPreferenceModalProps) {
  const [preference, setPreference] = useState<'combined' | 'separate'>('combined');

  const handleConfirm = () => {
    onConfirm(preference);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-super" data-testid="modal-serving-preference">
        <DialogHeader>
          <DialogTitle className="font-cute font-bold text-xl text-gray-800 text-center">
            How would you like your rice and dumplings? 🍚🥟
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-gray-600 text-sm">
            Since you're ordering both rice and dumplings, please choose how you'd like them served:
          </p>

          <RadioGroup 
            value={preference} 
            onValueChange={(value) => setPreference(value as 'combined' | 'separate')}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 rounded-kawaii border border-kawaii-pink/20 hover:bg-kawaii-cream/50 transition-colors">
              <RadioGroupItem value="combined" id="combined" />
              <Label htmlFor="combined" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-kawaii-pink mr-3" />
                  <div>
                    <div className="font-semibold">Combined in one plate</div>
                    <div className="text-sm text-gray-600">Dumplings served on top of rice</div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-kawaii border border-kawaii-pink/20 hover:bg-kawaii-cream/50 transition-colors">
              <RadioGroupItem value="separate" id="separate" />
              <Label htmlFor="separate" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 text-kawaii-mint mr-3" />
                  <div>
                    <div className="font-semibold">Separate plates</div>
                    <div className="text-sm text-gray-600">Rice and dumplings in different containers</div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-100"
              onClick={onClose}
              data-testid="button-cancel-preference"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-kawaii-mint to-kawaii-blue text-white font-cute font-semibold rounded-kawaii"
              onClick={handleConfirm}
              data-testid="button-confirm-preference"
            >
              Confirm Choice 🌸
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}