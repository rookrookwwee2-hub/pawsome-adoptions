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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MessageSquarePlus, CheckCircle, XCircle, Eye, Clock, Mail, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentSuggestion {
  id: string;
  email: string;
  suggested_method: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const PaymentSuggestionsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSuggestion, setSelectedSuggestion] = useState<PaymentSuggestion | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["admin-payment-suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_method_suggestions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentSuggestion[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from("payment_method_suggestions")
        .update({ status, admin_notes: notes || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payment-suggestions"] });
      toast({ title: "Updated", description: "Suggestion status updated successfully." });
      setSelectedSuggestion(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update suggestion.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_method_suggestions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payment-suggestions"] });
      toast({ title: "Deleted", description: "Suggestion deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete suggestion.", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      reviewed: "outline",
      contacted: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const stats = {
    total: suggestions.length,
    pending: suggestions.filter((s) => s.status === "pending").length,
    contacted: suggestions.filter((s) => s.status === "contacted").length,
    reviewed: suggestions.filter((s) => s.status === "reviewed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Suggestions</h1>
          <p className="text-muted-foreground">Review and manage payment method suggestions from clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MessageSquarePlus className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Suggestions</p>
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
                <Mail className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.contacted}</p>
                  <p className="text-sm text-muted-foreground">Contacted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.reviewed}</p>
                  <p className="text-sm text-muted-foreground">Reviewed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              All Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : suggestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payment suggestions yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Suggested Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((suggestion) => (
                    <TableRow key={suggestion.id}>
                      <TableCell>{format(new Date(suggestion.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <a href={`mailto:${suggestion.email}`} className="text-primary hover:underline">
                          {suggestion.email}
                        </a>
                      </TableCell>
                      <TableCell className="font-medium">{suggestion.suggested_method}</TableCell>
                      <TableCell>{getStatusBadge(suggestion.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedSuggestion(suggestion);
                                  setAdminNotes(suggestion.admin_notes || "");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Suggestion Details</DialogTitle>
                              </DialogHeader>
                              {selectedSuggestion && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Email</p>
                                      <a href={`mailto:${selectedSuggestion.email}`} className="font-medium text-primary hover:underline">
                                        {selectedSuggestion.email}
                                      </a>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Date</p>
                                      <p className="font-medium">{format(new Date(selectedSuggestion.created_at), "PPP")}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-muted-foreground">Suggested Method</p>
                                      <p className="font-medium">{selectedSuggestion.suggested_method}</p>
                                    </div>
                                  </div>

                                  {selectedSuggestion.message && (
                                    <div>
                                      <p className="text-muted-foreground text-sm">Additional Message</p>
                                      <p className="text-sm bg-muted p-3 rounded-lg mt-1">{selectedSuggestion.message}</p>
                                    </div>
                                  )}

                                  <div>
                                    <p className="text-muted-foreground text-sm mb-2">Admin Notes</p>
                                    <Textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="Add notes about this suggestion..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() =>
                                        updateMutation.mutate({
                                          id: selectedSuggestion.id,
                                          status: "reviewed",
                                          notes: adminNotes,
                                        })
                                      }
                                      disabled={updateMutation.isPending}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Mark Reviewed
                                    </Button>
                                    <Button
                                      className="flex-1"
                                      onClick={() =>
                                        updateMutation.mutate({
                                          id: selectedSuggestion.id,
                                          status: "contacted",
                                          notes: adminNotes,
                                        })
                                      }
                                      disabled={updateMutation.isPending}
                                    >
                                      <Mail className="h-4 w-4 mr-1" />
                                      Mark Contacted
                                    </Button>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: selectedSuggestion.id,
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
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Suggestion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this suggestion? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(suggestion.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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

export default PaymentSuggestionsManagement;
