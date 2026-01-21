import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Search,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface GuestPayment {
  id: string;
  pet_id: string;
  guest_name: string;
  guest_email: string;
  amount: number;
  transaction_hash: string | null;
  wallet_address: string;
  status: string;
  created_at: string;
  pets?: {
    name: string;
    type: string;
  };
}

type PaymentGateway = "all" | "stripe" | "paypal" | "checkoutcom" | "usdt" | "bank";
type DateRange = "7d" | "30d" | "90d" | "custom";

const GATEWAY_COLORS = {
  stripe: "hsl(var(--chart-1))",
  paypal: "hsl(var(--chart-2))",
  checkoutcom: "hsl(var(--chart-3))",
  usdt: "hsl(var(--chart-4))",
  bank: "hsl(var(--chart-5))",
};

const GATEWAY_LABELS: Record<string, string> = {
  stripe: "Stripe",
  paypal: "PayPal",
  checkoutcom: "Checkout.com",
  usdt: "USDT Crypto",
  bank: "Bank Transfer",
};

const detectGateway = (walletAddress: string): keyof typeof GATEWAY_COLORS => {
  const addr = walletAddress.toLowerCase();
  if (addr.includes("stripe")) return "stripe";
  if (addr.includes("paypal")) return "paypal";
  if (addr.includes("checkout.com")) return "checkoutcom";
  if (addr.includes("usdt") || addr.includes("trc20")) return "usdt";
  return "bank";
};

const PaymentAnalytics = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gatewayFilter, setGatewayFilter] = useState<PaymentGateway>("all");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>();
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["analytics-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_payments")
        .select("*, pets(name, type)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GuestPayment[];
    },
  });

  // Filtered payments based on all criteria
  const filteredPayments = useMemo(() => {
    if (!payments) return [];

    let filtered = payments;

    // Date range filter
    const now = new Date();
    let fromDate: Date;
    let toDate = endOfDay(now);

    if (dateRange === "custom" && customDateFrom && customDateTo) {
      fromDate = startOfDay(customDateFrom);
      toDate = endOfDay(customDateTo);
    } else {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      fromDate = startOfDay(subDays(now, days));
    }

    filtered = filtered.filter((p) => {
      const paymentDate = new Date(p.created_at);
      return isWithinInterval(paymentDate, { start: fromDate, end: toDate });
    });

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Gateway filter
    if (gatewayFilter !== "all") {
      filtered = filtered.filter((p) => detectGateway(p.wallet_address) === gatewayFilter);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.guest_name.toLowerCase().includes(searchLower) ||
          p.guest_email.toLowerCase().includes(searchLower) ||
          p.pets?.name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [payments, statusFilter, gatewayFilter, dateRange, customDateFrom, customDateTo, search]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = filteredPayments
      .filter((p) => p.status === "confirmed" || p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalTransactions = filteredPayments.length;
    const confirmedTransactions = filteredPayments.filter(
      (p) => p.status === "confirmed" || p.status === "completed"
    ).length;

    const avgTransactionValue = confirmedTransactions > 0 ? totalRevenue / confirmedTransactions : 0;

    // Gateway breakdown
    const gatewayBreakdown = filteredPayments.reduce((acc, p) => {
      const gateway = detectGateway(p.wallet_address);
      if (!acc[gateway]) {
        acc[gateway] = { count: 0, amount: 0 };
      }
      acc[gateway].count++;
      if (p.status === "confirmed" || p.status === "completed") {
        acc[gateway].amount += p.amount;
      }
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    // Daily trend data
    const dailyTrend = filteredPayments.reduce((acc, p) => {
      const date = format(new Date(p.created_at), "MMM d");
      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 };
      }
      if (p.status === "confirmed" || p.status === "completed") {
        acc[date].amount += p.amount;
      }
      acc[date].count++;
      return acc;
    }, {} as Record<string, { date: string; amount: number; count: number }>);

    return {
      totalRevenue,
      totalTransactions,
      confirmedTransactions,
      avgTransactionValue,
      gatewayBreakdown,
      dailyTrend: Object.values(dailyTrend).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    };
  }, [filteredPayments]);

  // Chart data
  const pieChartData = Object.entries(analytics.gatewayBreakdown).map(([gateway, data]) => ({
    name: GATEWAY_LABELS[gateway] || gateway,
    value: data.amount,
    count: data.count,
    fill: GATEWAY_COLORS[gateway as keyof typeof GATEWAY_COLORS] || "hsl(var(--muted))",
  }));

  const barChartData = Object.entries(analytics.gatewayBreakdown).map(([gateway, data]) => ({
    gateway: GATEWAY_LABELS[gateway] || gateway,
    amount: data.amount,
    count: data.count,
    fill: GATEWAY_COLORS[gateway as keyof typeof GATEWAY_COLORS] || "hsl(var(--muted))",
  }));

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Customer Name",
      "Email",
      "Pet",
      "Amount",
      "Gateway",
      "Status",
      "Transaction ID",
    ];

    const rows = filteredPayments.map((p) => [
      format(new Date(p.created_at), "yyyy-MM-dd HH:mm:ss"),
      p.guest_name,
      p.guest_email,
      p.pets?.name || "",
      p.amount.toFixed(2),
      GATEWAY_LABELS[detectGateway(p.wallet_address)] || detectGateway(p.wallet_address),
      p.status,
      p.transaction_hash || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "confirmed":
      case "completed":
        return <Badge className="bg-primary/10 text-primary">Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGatewayBadge = (walletAddress: string) => {
    const gateway = detectGateway(walletAddress);
    const colors: Record<string, string> = {
      stripe: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      paypal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      checkoutcom: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      usdt: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      bank: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return <Badge className={colors[gateway]}>{GATEWAY_LABELS[gateway]}</Badge>;
  };

  const chartConfig = {
    amount: { label: "Amount", color: "hsl(var(--primary))" },
    count: { label: "Transactions", color: "hsl(var(--chart-2))" },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Payment Analytics</h1>
            <p className="text-muted-foreground">
              Track revenue and transactions across all payment gateways
            </p>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">From confirmed payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.confirmedTransactions} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analytics.avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Per confirmed payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalTransactions > 0
                  ? Math.round((analytics.confirmedTransactions / analytics.totalTransactions) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Confirmed vs total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or pet..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={gatewayFilter} onValueChange={(v) => setGatewayFilter(v as PaymentGateway)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Gateways" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gateways</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="checkoutcom">Checkout.com</SelectItem>
                  <SelectItem value="usdt">USDT Crypto</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === "custom" && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        {customDateFrom ? format(customDateFrom, "MMM d") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={customDateFrom}
                        onSelect={setCustomDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10">
                        {customDateTo ? format(customDateTo, "MMM d") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={customDateTo}
                        onSelect={setCustomDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Gateway */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" /> Revenue by Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              `$${Number(value).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}`
                            }
                          />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected period
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transactions by Gateway */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Transactions by Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              {barChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="gateway" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected period
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.dailyTrend.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                        name="Revenue ($)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-2))" }}
                        name="Transactions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaction Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.slice(0, 50).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(payment.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.guest_name}</p>
                            <p className="text-sm text-muted-foreground">{payment.guest_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.pets?.name || "Unknown"}</TableCell>
                        <TableCell>{getGatewayBadge(payment.wallet_address)}</TableCell>
                        <TableCell className="font-medium">
                          ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {filteredPayments.length > 50 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 50 of {filteredPayments.length} transactions. Export CSV for full data.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PaymentAnalytics;
