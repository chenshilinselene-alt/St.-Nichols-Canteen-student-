import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm mx-auto bg-white rounded-super p-8 text-center" data-testid="modal-loading">
        <div className="kawaii-pulse mb-4">
          <Heart className="w-16 h-16 text-kawaii-pink mx-auto" />
        </div>
        <h3 className="font-cute font-bold text-xl text-gray-800 mb-2">Processing Payment...</h3>
        <p className="text-gray-600">Please wait while we process your PayLah! payment 💫</p>
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kawaii-pink"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
