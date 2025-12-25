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
import { Home, CheckCircle, XCircle, Eye, Users, Clock, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FosterApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  address: string;
  housing_type: string | null;
  has_yard: boolean | null;
  has_other_pets: boolean | null;
  other_pets_details: string | null;
  has_children: boolean | null;
  children_ages: string | null;
  experience: string | null;
  availability: string | null;
  preferred_pet_types: string[] | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const FosterManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<FosterApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin-foster-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foster_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FosterApplication[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from("foster_applications")
        .update({ status, admin_notes: notes || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-foster-applications"] });
      toast({ title: "Updated", description: "Application status updated successfully." });
      setSelectedApp(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update application.", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      active: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    active: applications.filter((a) => a.status === "active").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Foster Program</h1>
          <p className="text-muted-foreground">Manage foster family applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
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
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Fosters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Foster Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Housing</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{format(new Date(app.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.applicant_name}</p>
                          <p className="text-sm text-muted-foreground">{app.applicant_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{app.housing_type || "-"}</TableCell>
                      <TableCell className="capitalize">{app.availability?.replace("-", " ") || "-"}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app);
                                setAdminNotes(app.admin_notes || "");
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Foster Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedApp && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Applicant</p>
                                    <p className="font-medium">{selectedApp.applicant_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedApp.applicant_email}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedApp.applicant_phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Address</p>
                                    <p className="font-medium">{selectedApp.address}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                                  <div>
                                    <p className="text-muted-foreground">Housing Type</p>
                                    <p className="font-medium capitalize">{selectedApp.housing_type || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Has Yard</p>
                                    <p className="font-medium">{selectedApp.has_yard ? "Yes" : "No"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Has Other Pets</p>
                                    <p className="font-medium">{selectedApp.has_other_pets ? "Yes" : "No"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Has Children</p>
                                    <p className="font-medium">{selectedApp.has_children ? "Yes" : "No"}</p>
                                  </div>
                                </div>

                                {selectedApp.other_pets_details && (
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">Other Pets Details</p>
                                    <p>{selectedApp.other_pets_details}</p>
                                  </div>
                                )}

                                {selectedApp.children_ages && (
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">Children Ages</p>
                                    <p>{selectedApp.children_ages}</p>
                                  </div>
                                )}

                                {selectedApp.experience && (
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">Experience</p>
                                    <p>{selectedApp.experience}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Availability</p>
                                    <p className="font-medium capitalize">{selectedApp.availability?.replace("-", " ") || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Preferred Pets</p>
                                    <p className="font-medium capitalize">
                                      {selectedApp.preferred_pet_types?.join(", ") || "Any"}
                                    </p>
                                  </div>
                                </div>

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
                                        id: selectedApp.id,
                                        status: "approved",
                                        notes: adminNotes,
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: selectedApp.id,
                                        status: "active",
                                        notes: adminNotes,
                                      })
                                    }
                                    disabled={updateMutation.isPending}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Set Active
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() =>
                                      updateMutation.mutate({
                                        id: selectedApp.id,
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

export default FosterManagement;
