import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Eye, Check, X, Download, FileText, Clock, CheckCircle, XCircle, Trash2, ExternalLink, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentSource = "bank_proof" | "crypto" | "donation";

interface UnifiedProof {
  id: string;
  source: PaymentSource;
  // Common fields
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  sender_address: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_category: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  // Bank proof specific
  transaction_reference: string | null;
  transfer_date: string | null;
  file_url: string | null;
  file_name: string | null;
  shipping_method: string | null;
  shipping_cost: number | null;
  client_notes: string | null;
  // Deposit tracking
  full_order_total: number;
  deposit_amount: number;
  remaining_balance: number;
  balance_status: string;
  // Crypto specific
  transaction_hash: string | null;
  wallet_address: string | null;
  message: string | null;
  // Donation specific
  donation_type: string | null;
  // Pet info
  pet_name: string | null;
  pet_type: string | null;
  pet_fee: number | null;
  pet_location: string | null;
}

const getShippingMethodLabel = (method: string | null) => {
  if (!method) return "—";
  const labels: Record<string, string> = { ground: "Ground Transport", air_cargo: "Air Cargo", flight_nanny: "Flight Nanny" };
  if (method.includes("Ground")) return "Ground Transport";
  if (method.includes("Air Cargo")) return "Air Cargo";
  if (method.includes("Flight Nanny")) return "Flight Nanny";
  return labels[method] || method;
};

const getCategoryBadge = (category: string) => {
  const map: Record<string, { label: string; className: string }> = {
    order_full: { label: "Full Payment", className: "bg-primary/10 text-primary" },
    order_deposit: { label: "30% Deposit", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    order_balance: { label: "Balance Payment", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    donation: { label: "Donation", className: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400" },
  };
  const info = map[category] || { label: category, className: "" };
  return <Badge variant="secondary" className={info.className}>{info.label}</Badge>;
};

const ProofsOfPayment = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedProof, setSelectedProof] = useState<UnifiedProof | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteProof, setDeleteProof] = useState<{ id: string; source: PaymentSource } | null>(null);

  const { data: proofs = [], isLoading } = useQuery({
    queryKey: ["unified-proofs", statusFilter],
    queryFn: async () => {
      const results: UnifiedProof[] = [];

      // Fetch bank proofs
      let bankQuery = supabase
        .from("payment_proofs")
        .select("*, pets(name, type, adoption_fee, location, location_country, location_region)")
        .order("created_at", { ascending: false });
      if (statusFilter !== "all") bankQuery = bankQuery.eq("status", statusFilter);
      const { data: bankData } = await bankQuery;
      
      (bankData || []).forEach((p: any) => {
        results.push({
          id: p.id,
          source: "bank_proof",
          sender_name: p.guest_name || "Unknown",
          sender_email: p.guest_email || "",
          sender_phone: p.guest_phone,
          sender_address: p.guest_address,
          amount: p.amount_sent,
          currency: p.currency,
          payment_method: p.payment_method,
          payment_category: p.payment_category || "order_full",
          status: p.status,
          admin_notes: p.admin_notes,
          created_at: p.created_at,
          transaction_reference: p.transaction_reference,
          transfer_date: p.transfer_date,
          file_url: p.file_url,
          file_name: p.file_name,
          shipping_method: p.shipping_method,
          shipping_cost: p.shipping_cost,
          client_notes: p.client_notes,
          full_order_total: p.full_order_total || p.amount_sent,
          deposit_amount: p.deposit_amount || 0,
          remaining_balance: p.remaining_balance || 0,
          balance_status: p.balance_status || "not_applicable",
          transaction_hash: null,
          wallet_address: null,
          message: p.client_notes,
          donation_type: null,
          pet_name: p.pets?.name || null,
          pet_type: p.pets?.type || null,
          pet_fee: p.pets?.adoption_fee || null,
          pet_location: p.pets?.location || null,
        });
      });

      // Fetch crypto payments
      let cryptoQuery = supabase
        .from("guest_payments")
        .select("*, pets(name, type, adoption_fee, location, location_country, location_region)")
        .order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        const statusMap: Record<string, string> = { approved: "confirmed", pending: "pending", rejected: "rejected" };
        cryptoQuery = cryptoQuery.eq("status", statusMap[statusFilter] || statusFilter);
      }
      const { data: cryptoData } = await cryptoQuery;
      
      (cryptoData || []).forEach((p: any) => {
        results.push({
          id: p.id,
          source: "crypto",
          sender_name: p.guest_name,
          sender_email: p.guest_email,
          sender_phone: p.guest_phone,
          sender_address: p.guest_address,
          amount: p.amount,
          currency: "USD",
          payment_method: p.wallet_address || "Crypto",
          payment_category: p.payment_category || "order_full",
          status: p.status === "confirmed" ? "approved" : p.status,
          admin_notes: null,
          created_at: p.created_at,
          transaction_reference: null,
          transfer_date: null,
          file_url: null,
          file_name: null,
          shipping_method: p.shipping_method,
          shipping_cost: p.shipping_cost,
          client_notes: null,
          full_order_total: p.full_order_total || p.amount,
          deposit_amount: p.deposit_amount || 0,
          remaining_balance: p.remaining_balance || 0,
          balance_status: p.balance_status || "not_applicable",
          transaction_hash: p.transaction_hash,
          wallet_address: p.wallet_address,
          message: p.message,
          donation_type: null,
          pet_name: p.pets?.name || null,
          pet_type: p.pets?.type || null,
          pet_fee: p.pets?.adoption_fee || null,
          pet_location: p.pets?.location || null,
        });
      });

      // Fetch donations
      let donationQuery = supabase.from("donations").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        const dStatusMap: Record<string, string> = { approved: "verified", pending: "pending", rejected: "rejected" };
        donationQuery = donationQuery.eq("status", dStatusMap[statusFilter] || statusFilter);
      }
      const { data: donationData } = await donationQuery;

      (donationData || []).forEach((d: any) => {
        results.push({
          id: d.id,
          source: "donation",
          sender_name: d.donor_name,
          sender_email: d.donor_email,
          sender_phone: d.donor_phone,
          sender_address: null,
          amount: d.amount,
          currency: d.currency,
          payment_method: "Bank Transfer",
          payment_category: "donation",
          status: d.status === "verified" ? "approved" : d.status,
          admin_notes: d.admin_notes,
          created_at: d.created_at,
          transaction_reference: null,
          transfer_date: null,
          file_url: d.proof_file_url,
          file_name: d.proof_file_name,
          shipping_method: null,
          shipping_cost: null,
          client_notes: null,
          full_order_total: d.amount,
          deposit_amount: 0,
          remaining_balance: 0,
          balance_status: "not_applicable",
          transaction_hash: null,
          wallet_address: null,
          message: d.message,
          donation_type: d.donation_type,
          pet_name: null,
          pet_type: null,
          pet_fee: null,
          pet_location: null,
        });
      });

      // Sort by date
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return results;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ proof, newStatus, notes }: { proof: UnifiedProof; newStatus: string; notes?: string }) => {
      if (proof.source === "bank_proof") {
        const { error } = await supabase.from("payment_proofs").update({ status: newStatus, admin_notes: notes }).eq("id", proof.id);
        if (error) throw error;
      } else if (proof.source === "crypto") {
        const dbStatus = newStatus === "approved" ? "confirmed" : newStatus;
        const { error } = await supabase.from("guest_payments").update({ status: dbStatus }).eq("id", proof.id);
        if (error) throw error;
      } else if (proof.source === "donation") {
        const dbStatus = newStatus === "approved" ? "verified" : newStatus;
        const { error } = await supabase.from("donations").update({ status: dbStatus, admin_notes: notes }).eq("id", proof.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-proofs"] });
      toast.success("Status updated");
      setSelectedProof(null);
    },
    onError: (e: any) => toast.error("Failed to update", { description: e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, source }: { id: string; source: PaymentSource }) => {
      const table = source === "bank_proof" ? "payment_proofs" : source === "crypto" ? "guest_payments" : "donations";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-proofs"] });
      toast.success("Deleted successfully");
      setDeleteProof(null);
    },
    onError: (e: any) => toast.error("Delete failed", { description: e.message }),
  });

  const updateBalanceStatus = useMutation({
    mutationFn: async ({ proof }: { proof: UnifiedProof }) => {
      if (proof.source === "bank_proof") {
        const { error } = await supabase.from("payment_proofs").update({ balance_status: "paid" }).eq("id", proof.id);
        if (error) throw error;
      } else if (proof.source === "crypto") {
        const { error } = await supabase.from("guest_payments").update({ balance_status: "paid" }).eq("id", proof.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-proofs"] });
      toast.success("Balance marked as paid");
      setSelectedProof(null);
    },
  });

  const filtered = proofs.filter((p) => {
    const matchesSearch =
      p.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.pet_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.transaction_reference || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === "all" || p.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleDownloadFile = async (fileUrl: string, fileName: string | null) => {
    try {
      // Check if it's a full URL (donation proofs) or a storage path
      if (fileUrl.startsWith("http")) {
        window.open(fileUrl, "_blank");
        return;
      }
      const { data, error } = await supabase.storage.from("payment-proofs").download(fileUrl);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "proof";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Download failed", { description: e.message });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "approved":
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      case "completed":
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceBadge = (source: PaymentSource) => {
    const map: Record<PaymentSource, { label: string; className: string }> = {
      bank_proof: { label: "Bank", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
      crypto: { label: "Crypto", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
      donation: { label: "Donation", className: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400" },
    };
    const info = map[source];
    return <Badge variant="secondary" className={info.className}>{info.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Proofs of Payment</h1>
          <p className="text-muted-foreground">Unified view of all payment proofs — bank transfers, crypto, and donations</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, pet, or reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="bank_proof">Bank Transfers</SelectItem>
              <SelectItem value="crypto">Crypto Payments</SelectItem>
              <SelectItem value="donation">Donations</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No payment proofs found</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((proof) => (
                  <TableRow key={`${proof.source}-${proof.id}`}>
                    <TableCell className="text-sm">{format(new Date(proof.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{getSourceBadge(proof.source)}</TableCell>
                    <TableCell>{getCategoryBadge(proof.payment_category)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proof.sender_name}</p>
                        <p className="text-sm text-muted-foreground">{proof.sender_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {proof.pet_name ? (
                        <div>
                          <p className="font-medium">{proof.pet_name}</p>
                          <p className="text-sm text-muted-foreground">{proof.pet_type}</p>
                        </div>
                      ) : proof.donation_type ? (
                        <span className="text-sm text-muted-foreground capitalize">{proof.donation_type} donation</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="font-mono">{proof.currency} {proof.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(proof.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {proof.file_url && (
                          <Button variant="outline" size="sm" onClick={() => handleDownloadFile(proof.file_url!, proof.file_name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProof(proof); setAdminNotes(proof.admin_notes || ""); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteProof({ id: proof.id, source: proof.source })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Proof Details</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              {selectedProof && getSourceBadge(selectedProof.source)}
              {selectedProof && getCategoryBadge(selectedProof.payment_category)}
            </DialogDescription>
          </DialogHeader>

          {selectedProof && (
            <div className="space-y-5">
              {/* Animal Information */}
              {selectedProof.pet_name && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">🐾 Animal Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Animal Name</p><p className="font-medium">{selectedProof.pet_name}</p></div>
                    <div><p className="text-muted-foreground">Type</p><p className="font-medium">{selectedProof.pet_type}</p></div>
                    <div><p className="text-muted-foreground">Location</p><p className="font-medium">{selectedProof.pet_location || "—"}</p></div>
                    <div><p className="text-muted-foreground">Pet Price</p><p className="font-medium font-mono">${selectedProof.pet_fee ?? 0}</p></div>
                  </div>
                </div>
              )}

              {selectedProof.donation_type && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">❤️ Donation Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Donation Type</p><p className="font-medium capitalize">{selectedProof.donation_type}</p></div>
                    <div><p className="text-muted-foreground">Amount</p><p className="font-medium font-mono">{selectedProof.currency} {selectedProof.amount}</p></div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Client Information */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">👤 Sender Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Full Name</p><p className="font-medium">{selectedProof.sender_name}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedProof.sender_email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedProof.sender_phone || "—"}</p></div>
                  <div><p className="text-muted-foreground">Address</p><p className="font-medium">{selectedProof.sender_address || "—"}</p></div>
                </div>
              </div>

              {/* Shipping */}
              {selectedProof.shipping_method && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">🚚 Shipping Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-muted-foreground">Shipping Method</p><p className="font-medium">{getShippingMethodLabel(selectedProof.shipping_method)}</p></div>
                      <div><p className="text-muted-foreground">Shipping Cost</p><p className="font-medium font-mono">${selectedProof.shipping_cost ?? 0}</p></div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment & Deposit Info */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">💳 Payment Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Payment Method</p><p className="font-medium">{selectedProof.payment_method}</p></div>
                  <div><p className="text-muted-foreground">Amount Paid</p><p className="font-medium font-mono text-primary">{selectedProof.currency} {selectedProof.amount.toLocaleString()}</p></div>
                  {selectedProof.full_order_total > 0 && selectedProof.full_order_total !== selectedProof.amount && (
                    <div><p className="text-muted-foreground">Full Order Total</p><p className="font-medium font-mono">${selectedProof.full_order_total.toLocaleString()}</p></div>
                  )}
                  {selectedProof.deposit_amount > 0 && (
                    <>
                      <div><p className="text-muted-foreground">Deposit Paid</p><p className="font-medium font-mono">${selectedProof.deposit_amount.toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground">Remaining Balance</p><p className="font-medium font-mono">${selectedProof.remaining_balance.toLocaleString()}</p></div>
                      <div>
                        <p className="text-muted-foreground">Balance Status</p>
                        <Badge variant={selectedProof.balance_status === "paid" ? "default" : "secondary"}>
                          {selectedProof.balance_status === "paid" ? "Balance Paid" : "Balance Pending"}
                        </Badge>
                      </div>
                    </>
                  )}
                  {selectedProof.transfer_date && (
                    <div><p className="text-muted-foreground">Transfer Date</p><p className="font-medium">{format(new Date(selectedProof.transfer_date), "MMM d, yyyy")}</p></div>
                  )}
                  {selectedProof.transaction_reference && (
                    <div className="col-span-2"><p className="text-muted-foreground">Transaction Reference</p><p className="font-medium font-mono">{selectedProof.transaction_reference}</p></div>
                  )}
                  {selectedProof.transaction_hash && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted p-1 rounded break-all flex-1">{selectedProof.transaction_hash}</code>
                        <a href={`https://tronscan.org/#/transaction/${selectedProof.transaction_hash}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {(selectedProof.message || selectedProof.client_notes) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">📝 Notes</h4>
                    <div className="text-sm bg-muted p-3 rounded-lg space-y-1">
                      {(selectedProof.message || selectedProof.client_notes || "").split(" | ").map((part, idx) => (
                        <p key={idx}>{part}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Proof File */}
              {selectedProof.file_url && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm">{selectedProof.file_name || "Payment Proof"}</span>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadFile(selectedProof.file_url!, selectedProof.file_name)}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." rows={3} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => updateStatusMutation.mutate({ proof: selectedProof, newStatus: "approved", notes: adminNotes })} disabled={updateStatusMutation.isPending}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => updateStatusMutation.mutate({ proof: selectedProof, newStatus: "rejected", notes: adminNotes })} disabled={updateStatusMutation.isPending}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                {selectedProof.payment_category === "order_deposit" && selectedProof.balance_status !== "paid" && (
                  <Button variant="outline" className="flex-1" onClick={() => updateBalanceStatus.mutate({ proof: selectedProof })} disabled={updateBalanceStatus.isPending}>
                    <DollarSign className="h-4 w-4 mr-1" /> Mark Balance Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProof} onOpenChange={() => setDeleteProof(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Proof</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteProof && deleteMutation.mutate(deleteProof)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ProofsOfPayment;
