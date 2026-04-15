'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-supabase-auth";
import { useCart } from "@/hooks/use-cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Pizza,
  Receipt,
  Share2,
  Download,
  Star,
  Gift,
  Truck,
  Store,
  AlertCircle,
  UserPlus,
  RefreshCw,
  ArrowLeft,
  Calendar
} from "lucide-react";

// Helper function to parse EST timestamps from database
const parseESTTimestamp = (timestamp: string): Date => {
  if (!timestamp) return new Date();
  try {
    const cleanTimestamp = timestamp.replace(' ', 'T').split('.')[0];
    const estDate = new Date(cleanTimestamp + '-05:00');

    if (isNaN(estDate.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return new Date();
    }

    return estDate;
  } catch (error) {
    console.error('Error parsing timestamp:', timestamp, error);
    return new Date();
  }
};

// Fun loading messages to keep customers entertained
const LOADING_MESSAGES = [
  "Sending your order to the kitchen...",
  "Printing your receipt...",
  "Displaying your order on our kitchen TV...",
  "Processing your payment...",
  "Confirming with our chef...",
  "Chef Marco is inspecting the mozzarella...",
  "Nonna is nodding in approval...",
  "Tossing dough with unnecessary flair...",
  "Your pizza just got promoted to priority status...",
  "Adding a pinch of family secret (it's oregano)...",
  "Tony insists we need MORE cheese...",
  "Hand-selecting your toppings with tweezers...",
  "Making sure your pizza gets the window seat in the oven...",
  "Adding extra love (and garlic)...",
  "Creating a masterpiece in the kitchen...",
];

// Component that rotates through fun messages
const RotatingMessage = () => {
  const [currentMessage, setCurrentMessage] = useState(() => {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        let newMessage;
        do {
          newMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
        } while (newMessage === prev && LOADING_MESSAGES.length > 1);
        return newMessage;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-3 transition-opacity duration-300">
      <p className="text-gray-700 font-medium text-base animate-fade-in">
        {currentMessage}
      </p>
    </div>
  );
};

export default function OrderSuccessContent() {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);
  const isCreatingOrder = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderCreationError, setOrderCreationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize WebSocket for real-time updates

  // CRITICAL: Hard timeout to prevent infinite loading
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      setIsLoading(false);
      if (orderId && !order) {
        setOrder({
          id: orderId,
          status: 'pending',
          total: '0',
          items: [],
          createdAt: new Date().toISOString()
        });
      }
      if (!cartCleared) {
        clearCart();
        setCartCleared(true);
      }
    }, 3000);

    return () => clearTimeout(emergencyTimeout);
  }, [orderId, order, isLoading, cartCleared, clearCart]);

  // Get order ID from URL params or payment intent
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const paymentIntentParam = searchParams.get('payment_intent');

    if (orderIdParam) {
      setOrderId(parseInt(orderIdParam));
      const hadPendingOrder = sessionStorage.getItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderData');

      if (hadPendingOrder && !user && !cartCleared) {
        clearCart();
        setCartCleared(true);
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed. Check your phone for updates.",
        });
      }
    } else if (paymentIntentParam) {
      const processedKey = `processed_${paymentIntentParam}`;
      const alreadyProcessed = sessionStorage.getItem(processedKey);

      if (alreadyProcessed) {
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem(processedKey, 'processing');

      const pendingOrderDataStr = sessionStorage.getItem('pendingOrderData');
      if (pendingOrderDataStr) {
        try {
          const pendingOrderData = JSON.parse(pendingOrderDataStr);

          const createOrderAsync = async () => {
            try {
              const customerName = pendingOrderData.customerName || 'Guest';

              const confirmedOrderData = {
                ...pendingOrderData,
                status: "pending",
                paymentStatus: "succeeded",
                paymentIntentId: paymentIntentParam,
                customerName: customerName
              };

              const response = await apiRequest('POST', '/api/orders', confirmedOrderData);
              const createdOrder = await response.json();
              setOrderId(createdOrder.id);
              setOrder(createdOrder);

              if (!user) {
                const guestOrderKey = `guestOrder_${createdOrder.id}`;
                localStorage.setItem(guestOrderKey, JSON.stringify(createdOrder));
              }

              sessionStorage.removeItem('pendingOrderData');
              sessionStorage.setItem(processedKey, 'true');

              if (!cartCleared) {
                clearCart();
                setCartCleared(true);
              }

              setIsLoading(false);
              isCreatingOrder.current = false;

              toast({
                title: "Order Created Successfully!",
                description: `Order #${createdOrder.id} has been placed.`,
              });

              queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
              queryClient.invalidateQueries({ queryKey: ['/api/kitchen/orders'] });

              if (user && createdOrder?.id) {
                apiRequest('POST', '/api/award-points-for-order', {
                  orderId: createdOrder.id
                }).then(response => response.json())
                  .then(pointsResult => {
                    if (pointsResult.success && !pointsResult.alreadyAwarded) {
                      toast({
                        title: "Points Earned!",
                        description: `You earned ${pointsResult.pointsAwarded} points for this order!`,
                      });
                      queryClient.invalidateQueries({ queryKey: ['/api/user-rewards'] });
                    }
                  })
                  .catch(pointsError => {
                    console.warn('Points award failed:', pointsError);
                  });
              }
            } catch (error) {
              console.error('Error creating order:', error);
              sessionStorage.setItem(processedKey, 'error');
              isCreatingOrder.current = false;
              setOrderCreationError('Network error - unable to create order. Your payment was processed successfully.');
            }
          };

          createOrderAsync();
        } catch (error) {
          console.error('Error parsing pending order data:', error);
          setOrderCreationError('Unable to process order data. Please contact support.');
        }
      } else {
        console.warn('No pending order data found in sessionStorage');
        setOrderCreationError('Order data not found. Please contact support if your payment was charged.');
      }

      if (!cartCleared) {
        clearCart();
        setCartCleared(true);
      }
    } else {
      router.push("/");
    }
  }, [searchParams, user, cartCleared, clearCart, toast, router, queryClient]);

  // Timeout for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && orderId) {
        setIsLoading(false);
        if (!cartCleared) {
          clearCart();
          setCartCleared(true);
          toast({
            title: "Order Placed Successfully!",
            description: user
              ? "Your order has been placed. We couldn't load order details, but your order is being processed."
              : "Your order has been placed successfully! Check your phone for updates.",
          });
        }
      }
    }, user ? 1000 : 500);

    return () => clearTimeout(timeout);
  }, [isLoading, user, orderId, cartCleared, clearCart, toast]);

  // Fetch order details (only for authenticated users)
  const { data: orderData, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId && !!user,
    retry: 1,
    retryDelay: 200,
    staleTime: 0,
  });

  // For guest users, try to get order details from localStorage
  useEffect(() => {
    if (!user && orderId && !order) {
      const guestOrderKey = `guestOrder_${orderId}`;
      const storedOrder = localStorage.getItem(guestOrderKey);
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrder(parsedOrder);
          setIsLoading(false);

          const allKeys = Object.keys(localStorage);
          const guestOrderKeys = allKeys.filter(key => key.startsWith('guestOrder_'));
          if (guestOrderKeys.length > 5) {
            guestOrderKeys.sort().slice(0, -5).forEach(key => {
              localStorage.removeItem(key);
            });
          }
        } catch (error) {
          console.error('Error parsing guest order from localStorage:', error);
        }
      }
    }
  }, [user, orderId, order]);

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setIsLoading(false);

      if (!cartCleared && orderData && typeof orderData === 'object' && 'status' in orderData && 'id' in orderData) {
        clearCart();
        setCartCleared(true);
      }
    } else if (orderError) {
      console.warn('Failed to fetch order details:', orderError);
      setIsLoading(false);

      if (user && !cartCleared) {
        clearCart();
        setCartCleared(true);
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed. We couldn't load order details, but your order is being processed.",
        });
      }
    }
  }, [orderData, orderError, cartCleared, user, clearCart, toast]);

  // Listen for real-time order status updates
  useEffect(() => {
    const handleOrderStatusChange = (event: CustomEvent) => {
      const { orderId: updatedOrderId, status, order: updatedOrder } = event.detail;

      if (updatedOrderId === orderId) {
        setOrder(updatedOrder);
        queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      }
    };

    window.addEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);

    return () => {
      window.removeEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);
    };
  }, [orderId, queryClient]);

  // Calculate estimated pickup/delivery time
  const getEstimatedTime = () => {
    if (!order) return null;

    if (order.estimated_delivery_time) {
      const estimatedTime = parseESTTimestamp(order.estimated_delivery_time);
      return estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (order.fulfillmentTime === "scheduled" && order.scheduledTime) {
      const scheduledDate = parseESTTimestamp(order.scheduledTime);
      return scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const now = new Date();
    if (!order.createdAt) return null;
    const orderTime = parseESTTimestamp(order.createdAt);

    if (order.orderType === 'pickup') {
      const pickupTime = new Date(orderTime.getTime() + (20 * 60 * 1000));
      return pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const deliveryTime = new Date(orderTime.getTime() + (37 * 60 * 1000));
      return deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return "$0.00";
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string, shipdayStatus?: string) => {
    if (status === 'picked_up' || shipdayStatus === 'delivered' || shipdayStatus === 'picked_up') {
      return "bg-green-500";
    }
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "cooking": return "bg-orange-500";
      case "processing": return "bg-blue-500";
      case "ready": return "bg-green-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getDisplayStatus = (status: string, shipdayStatus?: string) => {
    if (status === 'picked_up' || shipdayStatus === 'picked_up') {
      return 'We hope you enjoy!';
    }
    if (shipdayStatus === 'delivered') {
      return 'Delivered!';
    }
    switch (status) {
      case 'pending': return 'Preparing';
      case 'cooking': return 'In the Oven';
      case 'completed': return "It's Ready!";
      case 'cancelled': return 'Cancelled';
      default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  const getPointsEarned = () => {
    if (!order) return 0;
    const total = parseFloat(order.total || 0);
    return isNaN(total) ? 0 : Math.floor(total);
  };

  const handleDownloadReceipt = () => {
    const receipt = `
Francesco's - Receipt
Order #${order?.id}
Date: ${order?.createdAt ? parseESTTimestamp(order.createdAt).toLocaleDateString() : 'N/A'}
Time: ${order?.createdAt ? parseESTTimestamp(order.createdAt).toLocaleTimeString() : 'N/A'}

Customer: ${user?.firstName} ${user?.lastName}
${order?.orderType === 'delivery' ? `Address: ${order?.address || user?.address}` : 'Pickup Order'}

Items:
${order?.items?.map((item: any) =>
  `${item.name} x${item.quantity} - ${item.isFreeItem || item.is_free_item || parseFloat(item.price || 0) === 0 ? 'FREE (Reward)' : formatCurrency(parseFloat(item.price || 0) * item.quantity)}`
).join('\n')}

Tax: ${formatCurrency(parseFloat(order?.tax || 0))}
${parseFloat(order?.deliveryFee || 0) > 0 ? `Delivery Fee: ${formatCurrency(parseFloat(order?.deliveryFee || 0))}` : ''}
${parseFloat(order?.tip || 0) > 0 ? `Tip: ${formatCurrency(parseFloat(order?.tip || 0))}` : ''}

Total: ${formatCurrency(parseFloat(order?.total || 0))}

Payment Status: ${order?.paymentStatus}
Order Status: ${order?.status}

Thank you for choosing Francesco's!
    `.trim();

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order?.id}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully.",
    });
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Order from Francesco's`,
        text: `I just ordered from Francesco's! Order #${order?.id}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`I just ordered from Francesco's! Order #${order?.id}`);
      toast({
        title: "Order Shared",
        description: "Order details copied to clipboard!",
      });
    }
  };

  const handleRefreshOrder = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}`] });
      await queryClient.refetchQueries({ queryKey: [`/api/orders/${orderId}`] });
      toast({
        title: "Order Updated",
        description: "Your order status has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetryOrderCreation = () => {
    setOrderCreationError(null);
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  // Error screen
  if (orderCreationError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-300 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-center text-red-900">Order Processing Issue</CardTitle>
            <CardDescription className="text-center text-red-700">
              {orderCreationError}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-700 mb-2 font-semibold">Important:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Your payment was processed successfully</li>
                <li>Click "Retry" to complete your order</li>
                <li>If retry doesn't work, please call us immediately</li>
                <li>Have your payment confirmation ready</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleRetryOrderCreation}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Order Creation
              </Button>

              <Button
                onClick={() => window.location.href = 'tel:+1234567890'}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Restaurant
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Retry attempt: {retryCount + 1}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Loading screen
  if (isLoading || orderLoading || (user && orderId && !order && !orderError)) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
          <RotatingMessage />
          <p className="text-red-700 font-semibold text-lg mb-2">Loading order confirmation</p>
          <p className="text-red-600 font-medium">Don't close this screen</p>
        </div>
      </main>
    );
  }

  // Order not found
  if (!order && user && !isLoading && !orderLoading && orderId && orderError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </main>
    );
  }

  // Safety check
  if (!order && !orderId) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
          <RotatingMessage />
          <p className="text-red-700 font-semibold text-lg mb-2">Loading order confirmation</p>
          <p className="text-red-600 font-medium">Don't close this screen</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:pt-24 pt-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/orders")}
          className="mb-6 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Orders
        </Button>

        {/* Status Hero Card */}
        <Card className="mb-6 overflow-hidden border-none shadow-2xl">
          <div className="bg-green-500 p-8 text-white">
            <div className="flex items-start justify-between flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                    <p className="text-white/90 text-lg">
                      {order ? getDisplayStatus(order.status, order.shipday_status) : 'Order Received'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-4 text-white/90 flex-wrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{order && order.createdAt ? parseESTTimestamp(order.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{order && order.createdAt ? parseESTTimestamp(order.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    }) : new Date().toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {order && order.orderType && (
                    <div className="flex items-center">
                      {order.orderType === 'pickup' ? <Store className="h-4 w-4 mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
                      <span>{order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                  <p className="text-white/80 text-sm mb-1">Total</p>
                  <p className="text-4xl font-bold">{order ? formatCurrency(parseFloat(order.total || 0)) : '$0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Items</h2>
                  <Badge variant="outline" className="text-sm">
                    {order?.items?.length || 0} items
                  </Badge>
                </div>

                {order ? (
                  <>
                    <div className="space-y-4">
                      {order.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#d73a31] to-[#ff6b35] rounded-lg flex items-center justify-center">
                            <Pizza className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{item?.name || 'Unknown Item'}</h3>
                            {item.options && Array.isArray(item.options) && item.options.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {item.options.map((option: any, optIndex: number) => (
                                  <p key={optIndex} className="text-sm text-gray-600">
                                    - {option.itemName || option.name}
                                    {option.price > 0 && ` (+${formatCurrency(option.price)})`}
                                  </p>
                                ))}
                              </div>
                            )}
                            {item.specialInstructions && (
                              <p className="text-sm text-gray-500 mt-2 italic">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Qty: {item.quantity}</p>
                            {item.isFreeItem || item.is_free_item || parseFloat(item.price) === 0 ? (
                              <div className="flex items-center gap-1 justify-end">
                                <Gift className="h-4 w-4 text-green-600" />
                                <span className="text-lg font-bold text-green-600">FREE</span>
                              </div>
                            ) : (
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatCurrency(parseFloat(order.tax || 0))}</span>
                      </div>
                      {parseFloat(order.deliveryFee || 0) > 0 && (
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>{formatCurrency(parseFloat(order.deliveryFee || 0))}</span>
                        </div>
                      )}
                      {parseFloat(order.tip || 0) > 0 && (
                        <div className="flex justify-between">
                          <span>Tip</span>
                          <span>{formatCurrency(parseFloat(order.tip || 0))}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(parseFloat(order.total || 0))}</span>
                      </div>

                      {user && (
                        <>
                          <Separator />
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-green-800">Points Earned</span>
                              </div>
                              <span className="text-lg font-bold text-green-600">+{getPointsEarned()} points</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              You earned 1 point for every dollar spent! Use your points to redeem rewards.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Order Placed Successfully!</h3>
                    <p className="text-gray-600 mb-4">
                      Your order has been received and is being prepared.
                    </p>
                    <p className="text-sm text-gray-500">
                      You should receive updates via phone call or SMS at the number you provided.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Status Timeline */}
            {order && (
              <Card className="border-none shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#d73a31]" />
                    Order Status
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshOrder}
                    disabled={isRefreshing}
                    className="h-9 hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center shadow-md ring-2 ring-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-600">{order.createdAt ? parseESTTimestamp(order.createdAt).toLocaleTimeString() : 'Order confirmed'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 relative ml-5 border-l-2 border-gray-200 pl-5 -mt-2 pb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        ['processing', 'ready', 'completed'].includes(order.status)
                          ? 'bg-gradient-to-br from-[#d73a31] to-[#c73128] ring-2 ring-red-200'
                          : 'bg-gray-100'
                      }`}>
                        <Pizza className={`h-5 w-5 ${
                          ['processing', 'ready', 'completed'].includes(order.status) ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Preparing Your Order</p>
                        <p className="text-sm text-gray-600">
                          {['processing', 'ready', 'completed'].includes(order.status) ? 'Your pizza is being prepared' : 'Will start soon'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 relative ml-5 border-l-2 border-gray-200 pl-5 -mt-2 pb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        ['ready', 'completed'].includes(order.status) || ['picked_up', 'out_for_delivery', 'delivered'].includes(order.shipday_status)
                          ? 'bg-gradient-to-br from-green-100 to-green-50 ring-2 ring-green-200'
                          : 'bg-gray-100'
                      }`}>
                        {order.orderType === 'pickup' ? (
                          <Store className={`h-5 w-5 ${['ready', 'completed'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`} />
                        ) : (
                          <Truck className={`h-5 w-5 ${['ready', 'completed'].includes(order.status) || ['picked_up', 'out_for_delivery', 'delivered'].includes(order.shipday_status) ? 'text-green-600' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {order.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {['ready', 'completed'].includes(order.status) ? 'Your order is ready!' : 'Will be ready soon'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          {user && order ? (
            <div className="space-y-6">
              {/* Estimated Time */}
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2 text-[#d73a31]" />
                    {order.fulfillmentTime === "scheduled" ? "Scheduled" : "Estimated"} {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'} Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-[#d73a31] mb-2">{getEstimatedTime()}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.estimated_delivery_time
                      ? "Live estimate from delivery service"
                      : order.fulfillmentTime === "scheduled"
                        ? `Scheduled for ${order.scheduledTime ? new Date(order.scheduledTime).toLocaleDateString() : 'scheduled time'}`
                        : order.orderType === 'pickup'
                          ? 'Your order will be ready for pickup'
                          : 'Your order will be delivered to your door'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {order.phone || order.userContactInfo?.phone || user?.phone || 'Contact information not provided'}
                    </span>
                  </div>
                  {order.orderType === 'delivery' && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">
                        {order.address || user?.address || 'Address not provided'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Google Review Prompt */}
              <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                    We hope you enjoyed your order!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Could you do us a huge favor and smash that 5 star button on Google? It really helps our local business grow!
                  </p>
                  <Button
                    onClick={() => window.open('https://g.page/r/CYxqsWclryrwEAE/review', '_blank')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Star className="h-4 w-4 mr-2 fill-white" />
                    Leave a Google Review
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Can't wait to see you again next time!
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadReceipt}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShareOrder}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Order
                  </Button>

                  <Button
                    className="w-full bg-[#d73a31] hover:bg-[#c73128]"
                    onClick={() => router.push("/menu")}
                  >
                    <Pizza className="h-4 w-4 mr-2" />
                    Order Again
                  </Button>
                </CardContent>
              </Card>

              {/* Rewards Reminder */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Gift className="h-5 w-5 mr-2" />
                    Earn Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-700 mb-3">
                    You earned points on this order! Use them to redeem rewards and get discounts on future orders.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => router.push("/rewards")}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Go to Rewards
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : user && !order ? (
            <div className="space-y-6">
              <Card>
                <CardContent className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your points and order details...</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Guest user - Missed Points Promotional Card */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    You Could Have Earned Points!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {Math.floor(parseFloat(order?.total || '0') || 0)} Points
                    </p>
                    <p className="text-sm text-red-700 mb-3">
                      Sign up for an account and earn 1 point for every dollar spent!
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-red-700">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Earn points on every order</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gift className="h-4 w-4" />
                      <span>Redeem for free food & discounts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Pizza className="h-4 w-4" />
                      <span>Exclusive member-only deals</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => router.push("/auth?tab=register")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account & Start Earning
                  </Button>

                  <p className="text-xs text-red-600 text-center">
                    Join thousands of happy customers earning rewards!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    If you have questions about your order, please call us:
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    (828) 225-2885
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Order ID: {orderId}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Continue Shopping</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => router.push("/menu")}
                  >
                    Order Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
