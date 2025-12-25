import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, CheckCircle, XCircle, Eye, DollarSign, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  amount: number;
  currency: string;
  donation_type: string;
  message: string | null;
  proof_file_url: string | null;
  proof_file_name: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const DonationsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Donation[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from("donations")
        .update({ status, admin_notes: notes || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      toast({ title: "Updated", description: "Donation status updated successfully." });
      setSelectedDonation(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update donation.", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      verified: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const stats = {
    total: donations.reduce((sum, d) => sum + (d.status === "verified" ? d.amount : 0), 0),
    pending: donations.filter((d) => d.status === "pending").length,
    verified: donations.filter((d) => d.status === "verified").length,
    monthly: donations.filter((d) => d.donation_type === "monthly" && d.status === "verified").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donations Management</h1>
          <p className="text-muted-foreground">Review and manage donation submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">${stats.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.verified}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.monthly}</p>
                  <p className="text-sm text-muted-foreground">Monthly Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              All Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : donations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No donations yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{format(new Date(donation.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{donation.donor_name}</p>
                          <p className="text-sm text-muted-foreground">{donation.donor_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${donation.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{donation.donation_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDonation(donation);
                                setAdminNotes(donation.admin_notes || "");
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Donation Details</DialogTitle>
                            </DialogHeader>
                            {selectedDonation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Donor</p>
                                    <p className="font-medium">{selectedDonation.donor_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedDonation.donor_email}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Amount</p>
                                    <p className="font-medium">${selectedDonation.amount.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Type</p>
                                    <p className="font-medium capitalize">{selectedDonation.donation_type}</p>
                                  </div>
                                </div>

                                {selectedDonation.message && (
                                  <div>
                                    <p className="text-muted-foreground text-sm">Message</p>
                                    <p className="text-sm">{selectedDonation.message}</p>
                                  </div>
                                )}

                                {selectedDonation.proof_file_url && (
                                  <div>
                                    <p className="text-muted-foreground text-sm mb-2">Proof of Payment</p>
                                    <a
                                      href={selectedDonation.proof_file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      View Proof ({selectedDonation.proof_file_name})
                                    </a>
                                  </div>
                                )}

                                <div>
                                  <p className="text-muted-foreground text-sm mb-2">Admin Notes</p>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes..."
                                    rows={2}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: selectedDonation.id,
                                        status: "verified",
                                        notes: adminNotes,
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: selectedDonation.id,
                                        status: "rejected",
                                        notes: adminNotes,
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DonationsManagement;
