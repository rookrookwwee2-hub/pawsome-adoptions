import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Upload,
  ChevronRight,
  Search,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Order {
  id: string;
  pet_id: string;
  pet_name: string;
  pet_image: string | null;
  amount: number;
  status: string;
  created_at: string;
  wallet_address: string;
  message: string | null;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      const { data: payments, error } = await supabase
        .from("guest_payments")
        .select(`
          id,
          pet_id,
          amount,
          status,
          created_at,
          wallet_address,
          message,
          pets!inner(name, image_url)
        `)
        .eq("guest_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders: Order[] = (payments || []).map((p: any) => ({
        id: p.id,
        pet_id: p.pet_id,
        pet_name: p.pets?.name || "Unknown Pet",
        pet_image: p.pets?.image_url,
        amount: p.amount,
        status: p.status,
        created_at: p.created_at,
        wallet_address: p.wallet_address,
        message: p.message,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time subscription for order status updates
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel("order-status-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "guest_payments",
        },
        (payload) => {
          const updatedPayment = payload.new as any;
          
          // Check if this update is for the current user's order
          if (updatedPayment.guest_email === user.email) {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === updatedPayment.id
                  ? { ...order, status: updatedPayment.status }
                  : order
              )
            );

            // Show toast notification for status change
            const statusInfo = statusConfig[updatedPayment.status] || statusConfig.pending;
            toast.success(`Order status updated!`, {
              description: `Your order is now: ${statusInfo.label}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          order.pet_name.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Date from filter
      if (dateFrom) {
        const orderDate = new Date(order.created_at);
        if (isBefore(orderDate, startOfDay(dateFrom))) return false;
      }

      // Date to filter
      if (dateTo) {
        const orderDate = new Date(order.created_at);
        if (isAfter(orderDate, endOfDay(dateTo))) return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFrom || dateTo;

  return (
    <>
      <Helmet>
        <title>Order History - Pawsfam</title>
        <meta name="description" content="View your pet adoption order history and payment status." />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">
              Track your adoption requests and payment status
            </p>
          </div>

          {/* Filters */}
          {orders.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by pet name or order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Date From */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "MMM d, yy") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Date To */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "MMM d, yy") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Results count */}
                  {hasActiveFilters && (
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start your adoption journey by finding your perfect companion!
                </p>
                <Button asChild className="rounded-full">
                  <Link to="/pets">Browse Pets</Link>
                </Button>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display text-xl font-bold mb-2">No matching orders</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters} className="rounded-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Pet Image */}
                        <div className="sm:w-32 h-32 sm:h-auto bg-muted shrink-0">
                          {order.pet_image ? (
                            <img
                              src={order.pet_image}
                              alt={order.pet_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{order.pet_name}</h3>
                                <Badge className={statusInfo.className}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>

                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  Order ID: <span className="font-mono">{order.id.slice(0, 8)}...</span>
                                </p>
                                <p>
                                  Date: {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                                <p>
                                  Payment Method: {order.wallet_address}
                                </p>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <p className="font-display text-2xl font-bold text-primary">
                                ${order.amount.toFixed(2)}
                              </p>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" asChild className="rounded-full">
                                  <Link to={`/pets/${order.pet_id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Pet
                                  </Link>
                                </Button>
                                {order.status === "pending" && (
                                  <Button size="sm" asChild className="rounded-full">
                                    <Link to="/payment-methods">
                                      <Upload className="h-4 w-4 mr-1" />
                                      Upload Proof
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {order.message && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Your message:</span> {order.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If your payment is pending for more than 48 hours, please ensure you've uploaded
                proof of payment. For any other issues, contact our support team.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link to="/payment-methods">
                    Upload Proof of Payment
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link to="/contact">
                    Contact Support
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderHistory;
