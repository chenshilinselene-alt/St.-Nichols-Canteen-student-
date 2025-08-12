import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cartStore } from "@/lib/cart-store";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import LoadingModal from "@/components/loading-modal";
import SuccessModal from "@/components/success-modal";
import { ArrowLeft, Smartphone, QrCode } from "lucide-react";

const checkoutSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  pickupTime: z.string().min(1, "Please select pickup time"),
  diningOption: z.string().min(1, "Please select dining option"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const cartItems = cartStore.getItems();
  const cartTotal = cartStore.getTotal();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      studentName: "",
      pickupTime: "",
      diningOption: "dine-in",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderResult(data);
      setShowLoading(false);
      setShowSuccess(true);
      cartStore.clear();
    },
    onError: () => {
      setShowLoading(false);
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    const orderData = {
      ...data,
      studentClass: null, // No longer required
      items: cartItems,
      total: cartTotal.toString(),
      status: "pending",
      paymentMethod: "paylah",
    };

    setShowLoading(true);
    createOrderMutation.mutate(orderData);
  };

  const handleBackToMenu = () => {
    setShowSuccess(false);
    setLocation("/");
  };

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kawaii-cream via-kawaii-blue to-kawaii-mint flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🥺</div>
            <h1 className="font-cute font-bold text-xl text-gray-800 mb-2">Cart is Empty!</h1>
            <p className="text-gray-600 mb-4">Add some delicious food to your cart first!</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-kawaii-pink hover:bg-kawaii-peach text-white"
              data-testid="button-back-to-menu"
            >
              Back to Menu 🌸
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-cream via-kawaii-blue to-kawaii-mint">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-kawaii sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-cute font-bold text-xl text-gray-800">Checkout 🛍️💕</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* PayNow QR Code */}
        <Card className="bg-purple-50 rounded-kawaii mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-semibold text-purple-700">PayNow Payment</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200 mb-3">
              <img 
                src="/attached_assets/IMG_0621_1754793482517.png"
                alt="PayNow QR Code"
                className="w-40 h-40 mx-auto object-contain"
              />
            </div>
            <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
              <p className="text-sm font-semibold text-purple-800 text-center">
                Your order will be sent after payment
              </p>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Information */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-kawaii">
              <CardHeader>
                <CardTitle className="font-cute text-lg text-gray-800">Student Information 📝</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name 📝" 
                          className="border-kawaii-pink/30 focus:border-kawaii-pink rounded-kawaii"
                          data-testid="input-student-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="pickupTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-kawaii-pink/30 focus:border-kawaii-pink rounded-kawaii" data-testid="select-pickup-time">
                            <SelectValue placeholder="Choose pickup time ⏰" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="10:30 AM">10:30 AM - Morning Break</SelectItem>
                          <SelectItem value="11:00 AM">11:00 AM - Mid Morning</SelectItem>
                          <SelectItem value="11:30 AM">11:30 AM - Pre Lunch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diningOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dining Option</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-kawaii-pink/30 focus:border-kawaii-pink rounded-kawaii" data-testid="select-dining-option">
                            <SelectValue placeholder="Choose dining option 🍽️" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dine-in">🍽️ Dine In (Plate)</SelectItem>
                          <SelectItem value="takeaway">📦 Takeaway (Container)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-kawaii-cream/90 backdrop-blur-sm shadow-kawaii">
              <CardHeader>
                <CardTitle className="font-cute text-lg text-gray-800">Order Summary 📋</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex justify-between items-center" data-testid={`item-${item.menuItem.id}`}>
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">{item.menuItem.emoji}</span>
                        <span className="text-sm">{item.menuItem.name}</span>
                      </span>
                      <span className="font-semibold text-kawaii-pink">${item.finalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="bg-kawaii-pink/30" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-kawaii-pink" data-testid="text-total">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-kawaii">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-8 h-8" />
                  <div>
                    <h4 className="font-semibold text-lg">PayLah!</h4>
                    <p className="text-sm opacity-90">Pay securely with PayLah!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-100"
                onClick={() => setLocation("/")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-kawaii-pink to-kawaii-peach hover:from-kawaii-peach hover:to-kawaii-pink text-white font-cute font-semibold rounded-kawaii shadow-kawaii hover:shadow-kawaii-hover transition-all duration-300"
                disabled={createOrderMutation.isPending}
                data-testid="button-pay"
              >
                Submit Order
              </Button>
            </div>
          </form>
        </Form>
      </main>

      <LoadingModal isOpen={showLoading} />
      <SuccessModal 
        isOpen={showSuccess}
        orderData={orderResult}
        onClose={handleBackToMenu}
      />
    </div>
  );
}
