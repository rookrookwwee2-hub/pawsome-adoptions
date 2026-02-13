import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Eye, Search, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface GuestPayment {
  id: string;
  pet_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_address: string | null;
  amount: number;
  transaction_hash: string | null;
  wallet_address: string;
  shipping_method: string | null;
  shipping_cost: number | null;
  status: string;
  message: string | null;
  created_at: string;
  pets?: {
    name: string;
    type: string;
    adoption_fee: number | null;
    location: string | null;
    location_country: string | null;
    location_region: string | null;
  };
}

const getShippingMethodLabel = (method: string | null) => {
  if (!method) return "—";
  const labels: Record<string, string> = {
    ground: "Ground Transport",
    air_cargo: "Air Cargo",
    flight_nanny: "Flight Nanny",
  };
  // Handle longer format like "ground_US" or "Air Cargo to United States"
  if (method.includes("Ground")) return "Ground Transport";
  if (method.includes("Air Cargo")) return "Air Cargo";
  if (method.includes("Flight Nanny")) return "Flight Nanny";
  return labels[method] || method;
};

const GuestPaymentsManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<GuestPayment | null>(null);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["guest-payments", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("guest_payments")
        .select("*, pets(name, type, adoption_fee, location, location_country, location_region)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GuestPayment[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "confirmed" | "rejected" }) => {
      const { error } = await supabase.from("guest_payments").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["guest-payments"] });
      toast.success(`Payment ${status}!`);
      setSelectedPayment(null);
    },
    onError: () => {
      toast.error("Failed to update payment status");
    },
  });

  const filteredPayments = payments?.filter(
    (payment) =>
      payment.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      payment.guest_email.toLowerCase().includes(search.toLowerCase()) ||
      payment.pets?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Guest Payments</h1>
          <p className="text-muted-foreground">Manage USDT cryptocurrency payments from guests</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or pet..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Loading payments...</TableCell>
                </TableRow>
              ) : filteredPayments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payments found</TableCell>
                </TableRow>
              ) : (
                filteredPayments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.guest_name}</p>
                        <p className="text-sm text-muted-foreground">{payment.guest_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{payment.guest_phone || "—"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.pets?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{payment.pets?.type || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getShippingMethodLabel(payment.shipping_method)}
                    </TableCell>
                    <TableCell className="font-medium">${payment.amount} USDT</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(payment.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" className="text-primary hover:text-primary" onClick={() => updateStatusMutation.mutate({ id: payment.id, status: "confirmed" })}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => updateStatusMutation.mutate({ id: payment.id, status: "rejected" })}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Payment Details Dialog */}
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Full order and crypto payment information</DialogDescription>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-5">
                {/* Animal Information */}
                {selectedPayment.pets && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">🐾 Animal Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Animal Name</p>
                        <p className="font-medium">{selectedPayment.pets.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type / Species</p>
                        <p className="font-medium">{selectedPayment.pets.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{selectedPayment.pets.location || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pet Price</p>
                        <p className="font-medium font-mono">${selectedPayment.pets.adoption_fee ?? 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Client Information */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">👤 Client Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedPayment.guest_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedPayment.guest_email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedPayment.guest_phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedPayment.guest_address || "—"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shipping Information */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">🚚 Shipping Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Shipping Method</p>
                      <p className="font-medium">{getShippingMethodLabel(selectedPayment.shipping_method)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shipping Cost</p>
                      <p className="font-medium font-mono">
                        ${selectedPayment.shipping_cost ?? Math.max(0, selectedPayment.amount - (selectedPayment.pets?.adoption_fee ?? 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Information */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">💳 Payment Information</h4>
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Crypto Payment (USDT)</p>
                        <p className="font-display text-2xl font-bold text-primary">${selectedPayment.amount} USDT</p>
                      </div>
                      {getStatusBadge(selectedPayment.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                    <div>
                      <p className="text-muted-foreground">Wallet Address</p>
                      <code className="text-xs bg-muted p-1 rounded break-all">{selectedPayment.wallet_address}</code>
                    </div>
                  </div>
                </div>

                {selectedPayment.transaction_hash && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-muted p-2 rounded break-all">{selectedPayment.transaction_hash}</code>
                      <a href={`https://tronscan.org/#/transaction/${selectedPayment.transaction_hash}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                      </a>
                    </div>
                  </div>
                )}

                {selectedPayment.message && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">📝 Order Details & Notes</h4>
                      <div className="text-sm bg-muted p-3 rounded space-y-1">
                        {selectedPayment.message.split(" | ").map((part, idx) => (
                          <p key={idx}>{part}</p>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedPayment.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => updateStatusMutation.mutate({ id: selectedPayment.id, status: "rejected" })}>
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button className="flex-1" onClick={() => updateStatusMutation.mutate({ id: selectedPayment.id, status: "confirmed" })}>
                      <Check className="w-4 h-4 mr-2" /> Confirm Payment
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default GuestPaymentsManagement;