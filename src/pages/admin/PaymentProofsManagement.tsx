import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Eye, Check, X, Download, FileText, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentProof {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_address: string | null;
  transaction_reference: string;
  transfer_date: string;
  amount_sent: number;
  currency: string;
  payment_method: string;
  shipping_method: string | null;
  shipping_cost: number | null;
  client_notes: string | null;
  file_url: string;
  file_name: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  pet_id: string | null;
  user_id: string | null;
  pets?: {
    name: string;
    type: string;
    adoption_fee: number | null;
    location: string | null;
    location_country: string | null;
    location_region: string | null;
  } | null;
}

const PaymentProofsManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteProofId, setDeleteProofId] = useState<string | null>(null);

  const { data: proofs = [], isLoading } = useQuery({
    queryKey: ["payment-proofs", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("payment_proofs")
        .select("*, pets(name, type, adoption_fee, location, location_country, location_region)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PaymentProof[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from("payment_proofs")
        .update({ status, admin_notes: notes })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
      toast.success("Status updated successfully");
      setSelectedProof(null);
    },
    onError: (error: any) => {
      toast.error("Failed to update status", { description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_proofs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-proofs"] });
      toast.success("Payment proof deleted successfully");
      setDeleteProofId(null);
    },
    onError: (error: any) => {
      toast.error("Failed to delete payment proof", { description: error.message });
    },
  });

  const filteredProofs = proofs.filter(
    (proof) =>
      proof.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proof.guest_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proof.transaction_reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "approved":
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      uk_bacs: "UK BACS/Faster Payments",
      usa_ach: "USA ACH",
      usa_wire: "USA Wire Transfer",
      sepa: "SEPA Transfer",
    };
    return labels[method] || method;
  };

  const getShippingMethodLabel = (method: string | null) => {
    if (!method) return "—";
    const labels: Record<string, string> = {
      ground: "Ground Transport",
      air_cargo: "Air Cargo",
      flight_nanny: "Flight Nanny",
    };
    return labels[method] || method;
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string | null) => {
    try {
      const { data, error } = await supabase.storage.from("payment-proofs").download(fileUrl);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "payment-proof";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Download failed", { description: error.message });
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (!selectedProof) return;
    updateStatusMutation.mutate({ id: selectedProof.id, status, notes: adminNotes });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Proofs</h1>
          <p className="text-muted-foreground">Review and verify submitted payment proofs</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
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
        ) : filteredProofs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No payment proofs found</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProofs.map((proof) => (
                  <TableRow key={proof.id}>
                    <TableCell className="text-sm">
                      {format(new Date(proof.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proof.guest_name}</p>
                        <p className="text-sm text-muted-foreground">{proof.guest_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proof.pets?.name || "—"}</p>
                        <p className="text-sm text-muted-foreground">{proof.pets?.type || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getShippingMethodLabel(proof.shipping_method)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {proof.currency} {proof.amount_sent.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {proof.transaction_reference}
                    </TableCell>
                    <TableCell>{getStatusBadge(proof.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadFile(proof.file_url, proof.file_name)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProof(proof); setAdminNotes(proof.admin_notes || ""); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteProofId(proof.id)}>
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
            <DialogDescription>Full order and payment information</DialogDescription>
          </DialogHeader>

          {selectedProof && (
            <div className="space-y-5">
              {/* Animal Information */}
              {selectedProof.pets && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">🐾 Animal Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Animal Name</p>
                      <p className="font-medium">{selectedProof.pets.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type / Species</p>
                      <p className="font-medium">{selectedProof.pets.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedProof.pets.location || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pet Price</p>
                      <p className="font-medium font-mono">${selectedProof.pets.adoption_fee ?? 0}</p>
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
                    <p className="font-medium">{selectedProof.guest_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedProof.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedProof.guest_phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{selectedProof.guest_address || "—"}</p>
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
                    <p className="font-medium">{getShippingMethodLabel(selectedProof.shipping_method)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shipping Cost</p>
                    <p className="font-medium font-mono">
                      ${selectedProof.shipping_cost ?? Math.max(0, selectedProof.amount_sent - (selectedProof.pets?.adoption_fee ?? 0))}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">💳 Payment Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{getPaymentMethodLabel(selectedProof.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Paid</p>
                    <p className="font-medium font-mono text-primary">
                      {selectedProof.currency} {selectedProof.amount_sent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transfer Date</p>
                    <p className="font-medium">{format(new Date(selectedProof.transfer_date), "MMM d, yyyy")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Transaction Reference</p>
                    <p className="font-medium font-mono">{selectedProof.transaction_reference}</p>
                  </div>
                </div>
              </div>

              {/* Client Notes */}
              {selectedProof.client_notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">📝 Client Notes</h4>
                    <p className="text-sm bg-muted p-3 rounded-lg">{selectedProof.client_notes}</p>
                  </div>
                </>
              )}

              {/* Proof File */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm">{selectedProof.file_name || "Payment Proof"}</span>
                <Button variant="outline" size="sm" onClick={() => handleDownloadFile(selectedProof.file_url, selectedProof.file_name)}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this payment proof..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate("approved")} disabled={updateStatusMutation.isPending}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate("rejected")} disabled={updateStatusMutation.isPending}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProofId} onOpenChange={() => setDeleteProofId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Proof</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteProofId && deleteMutation.mutate(deleteProofId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default PaymentProofsManagement;