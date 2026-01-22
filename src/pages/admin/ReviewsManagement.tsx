import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Check,
  X,
  Edit,
  Trash2,
  Upload,
  Star,
  Cat,
  Dog,
  Eye,
  Filter,
} from "lucide-react";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  user_id: string | null;
  adoption_id: string | null;
  customer_name: string;
  customer_email: string | null;
  country: string;
  country_flag: string | null;
  pet_type: string;
  review_text: string;
  photo_url: string | null;
  status: string;
  display_location: string;
  admin_notes: string | null;
  created_at: string;
}

type NewReview = Omit<Review, "created_at">;

const ReviewsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [creatingReview, setCreatingReview] = useState<NewReview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Review> & { id: string }) => {
      const { id, ...data } = updates;
      const { error } = await supabase
        .from("reviews")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review updated successfully" });
      setEditingReview(null);
    },
    onError: (error) => {
      toast({ title: "Error updating review", description: error.message, variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: NewReview) => {
      const { error } = await supabase
        .from("reviews")
        .insert({
          ...payload,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review created successfully" });
      setCreatingReview(null);
    },
    onError: (error) => {
      toast({ title: "Error creating review", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review deleted successfully" });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting review", description: error.message, variant: "destructive" });
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const target = editingReview ?? creatingReview;
    if (!target) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${target.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("review-photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("review-photos")
        .getPublicUrl(fileName);

      if (editingReview) {
        setEditingReview({ ...editingReview, photo_url: publicUrl });
      } else if (creatingReview) {
        setCreatingReview({ ...creatingReview, photo_url: publicUrl });
      }
      toast({ title: "Photo uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Error uploading photo", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const startCreate = () => {
    setCreatingReview({
      id: crypto.randomUUID(),
      user_id: null,
      adoption_id: null,
      customer_name: "",
      customer_email: null,
      country: "",
      country_flag: null,
      pet_type: "dog",
      review_text: "",
      photo_url: null,
      status: "approved",
      display_location: "reviews_page",
      admin_notes: null,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getLocationBadge = (location: string) => {
    switch (location) {
      case "homepage":
        return <Badge variant="outline">Homepage</Badge>;
      case "both":
        return <Badge className="bg-primary/10 text-primary">Both</Badge>;
      default:
        return <Badge variant="outline">Reviews Page</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reviews Management</h1>
            <p className="text-muted-foreground">
              Manage customer reviews and testimonials
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={startCreate}>
              Add Review
            </Button>
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
          <div className="bg-card p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {reviews.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {reviews.filter((r) => r.status === "approved").length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground">On Homepage</p>
            <p className="text-2xl font-bold text-primary">
              {reviews.filter((r) => r.display_location === "homepage" || r.display_location === "both").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Display</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {review.photo_url ? (
                          <img
                            src={review.photo_url}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {review.customer_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{review.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.country} {review.country_flag}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate text-sm">
                        {review.review_text}
                      </p>
                    </TableCell>
                    <TableCell>
                      {review.pet_type === "cat" ? (
                        <Cat className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Dog className="w-5 h-5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>{getLocationBadge(review.display_location)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() =>
                                updateMutation.mutate({ id: review.id, status: "approved" })
                              }
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                updateMutation.mutate({ id: review.id, status: "rejected" })
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingReview(review)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(review.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={editingReview.customer_name}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, customer_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={editingReview.country}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, country: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country Flag (emoji)</Label>
                  <Input
                    value={editingReview.country_flag || ""}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, country_flag: e.target.value })
                    }
                    placeholder="🇺🇸"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pet Type</Label>
                  <Select
                    value={editingReview.pet_type}
                    onValueChange={(value) =>
                      setEditingReview({ ...editingReview, pet_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review Text</Label>
                <Textarea
                  value={editingReview.review_text}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, review_text: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingReview.status}
                    onValueChange={(value) =>
                      setEditingReview({ ...editingReview, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Location</Label>
                  <Select
                    value={editingReview.display_location}
                    onValueChange={(value) =>
                      setEditingReview({ ...editingReview, display_location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviews_page">Reviews Page Only</SelectItem>
                      <SelectItem value="homepage">Homepage Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  {editingReview.photo_url && (
                    <img
                      src={editingReview.photo_url}
                      alt=""
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={editingReview.admin_notes || ""}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, admin_notes: e.target.value })
                  }
                  rows={2}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReview(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingReview) {
                  updateMutation.mutate(editingReview);
                }
              }}
              disabled={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={!!creatingReview} onOpenChange={() => setCreatingReview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          {creatingReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={creatingReview.customer_name}
                    onChange={(e) =>
                      setCreatingReview({ ...creatingReview, customer_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={creatingReview.country}
                    onChange={(e) =>
                      setCreatingReview({ ...creatingReview, country: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country Flag (emoji)</Label>
                  <Input
                    value={creatingReview.country_flag || ""}
                    onChange={(e) =>
                      setCreatingReview({
                        ...creatingReview,
                        country_flag: e.target.value || null,
                      })
                    }
                    placeholder="🇺🇸"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pet Type</Label>
                  <Select
                    value={creatingReview.pet_type}
                    onValueChange={(value) =>
                      setCreatingReview({ ...creatingReview, pet_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review Text</Label>
                <Textarea
                  value={creatingReview.review_text}
                  onChange={(e) =>
                    setCreatingReview({ ...creatingReview, review_text: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={creatingReview.status}
                    onValueChange={(value) =>
                      setCreatingReview({ ...creatingReview, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Location</Label>
                  <Select
                    value={creatingReview.display_location}
                    onValueChange={(value) =>
                      setCreatingReview({ ...creatingReview, display_location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviews_page">Reviews Page Only</SelectItem>
                      <SelectItem value="homepage">Homepage Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  {creatingReview.photo_url && (
                    <img
                      src={creatingReview.photo_url}
                      alt=""
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={creatingReview.admin_notes || ""}
                  onChange={(e) =>
                    setCreatingReview({
                      ...creatingReview,
                      admin_notes: e.target.value || null,
                    })
                  }
                  rows={2}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatingReview(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => creatingReview && createMutation.mutate(creatingReview)}
              disabled={createMutation.isPending || !creatingReview?.customer_name || !creatingReview?.country || !creatingReview?.review_text}
            >
              Create Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ReviewsManagement;
