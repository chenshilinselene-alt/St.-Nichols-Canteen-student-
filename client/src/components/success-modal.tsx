import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, QrCode, Clock, Users } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  orderData: any;
  onClose: () => void;
}

// Generate a simple order number
const generateOrderNumber = () => {
  const prefix = "#AJ";
  const number = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `${prefix}${number}`;
};

// Calculate estimated pickup time (current time + queue wait)
const calculateEstimatedTime = (queueLength: number) => {
  const now = new Date();
  const estimatedMinutes = queueLength * 3; // 3 minutes per order
  const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60000);
  return estimatedTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export default function SuccessModal({ isOpen, orderData, onClose }: SuccessModalProps) {
  const orderNumber = generateOrderNumber();
  const queueLength = Math.floor(Math.random() * 8) + 1; // 1-8 people in queue
  const estimatedTime = calculateEstimatedTime(queueLength);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm mx-auto bg-white rounded-super p-6 text-center" data-testid="modal-success">
        <div className="kawaii-bounce mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h3 className="font-cute font-bold text-xl text-gray-800 mb-2">Order Confirmed! 🎉</h3>
        <p className="text-gray-600 mb-4">Your order will be sent after payment.</p>
        
        {/* Order Details */}
        <Card className="bg-kawaii-cream/50 rounded-kawaii mb-4">
          <CardContent className="p-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Order Number:</span>
                <span className="font-mono font-bold text-kawaii-pink" data-testid="text-order-number">{orderNumber}</span>
              </div>
              {orderData && (
                <div className="flex justify-between">
                  <span className="font-semibold">Transaction ID:</span>
                  <span className="font-mono text-xs" data-testid="text-transaction-id">{orderData.transactionId}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Queue Information */}
        <Card className="bg-kawaii-mint/20 rounded-kawaii mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-kawaii-pink mr-2" />
              <span className="font-semibold text-gray-800">Queue Status</span>
            </div>
            <p className="text-lg font-bold text-kawaii-pink mb-1">
              {queueLength} people in line!
            </p>

          </CardContent>
        </Card>


        
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-kawaii-mint to-kawaii-blue text-white font-cute font-semibold py-3 rounded-kawaii"
          data-testid="button-back-to-menu"
        >
          Yay! Back to Menu 🌸
        </Button>
      </DialogContent>
    </Dialog>
  );
}
