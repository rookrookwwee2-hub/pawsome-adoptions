import { useEffect, useState } from "react";
import { Check, X, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Database } from "@/integrations/supabase/types";

type AdoptionRow = Database['public']['Tables']['adoptions']['Row'];
type PetInfo = { name: string; type: string; image_url: string | null };
type ProfileInfo = { full_name: string | null; email: string };

interface Adoption extends AdoptionRow {
  pets: PetInfo | null;
  profile: ProfileInfo | null;
}

const AdoptionsManagement = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const fetchAdoptions = async () => {
    // Fetch adoptions with pets
    const { data: adoptionsData, error: adoptionsError } = await supabase
      .from('adoptions')
      .select(`*, pets (name, type, image_url)`)
      .order('created_at', { ascending: false });

    if (adoptionsError) {
      console.error('Error fetching adoptions:', adoptionsError);
      setLoading(false);
      return;
    }

    // Fetch profiles separately
    const userIds = [...new Set((adoptionsData || []).map(a => a.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds);

    const profileMap = new Map((profilesData || []).map(p => [p.id, p]));

    const combined = (adoptionsData || []).map(adoption => ({
      ...adoption,
      profile: profileMap.get(adoption.user_id) || null,
    })) as Adoption[];

    setAdoptions(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const filteredAdoptions = adoptions.filter(
    (adoption) =>
      adoption.pets?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adoption.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adoption.profile?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = async (id: string, status: 'approved' | 'rejected', petId?: string) => {
    const { error } = await supabase
      .from('adoptions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // If approved, update pet status to adopted
    if (status === 'approved' && petId) {
      await supabase
        .from('pets')
        .update({ status: 'adopted' })
        .eq('id', petId);
    }

    toast({ 
      title: "Success", 
      description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully` 
    });
    fetchAdoptions();
  };

  const viewDetails = (adoption: Adoption) => {
    setSelectedAdoption(adoption);
    setDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Adoption Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage adoption applications
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAdoptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdoptions.map((adoption) => (
                  <TableRow key={adoption.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={adoption.pets?.image_url || "/placeholder.svg"}
                          alt={adoption.pets?.name || "Pet"}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{adoption.pets?.name}</p>
                          <p className="text-sm text-muted-foreground">{adoption.pets?.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{adoption.profile?.full_name || "N/A"}</TableCell>
                    <TableCell>{adoption.profile?.email}</TableCell>
                    <TableCell>
                      {new Date(adoption.created_at!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          adoption.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : adoption.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {adoption.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetails(adoption)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {adoption.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(adoption.id, 'approved', adoption.pet_id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(adoption.id, 'rejected')}
                              className="text-destructive hover:text-destructive"
                            >
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

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedAdoption && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAdoption.pets?.image_url || "/placeholder.svg"}
                    alt={selectedAdoption.pets?.name || "Pet"}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {selectedAdoption.pets?.name}
                    </h3>
                    <p className="text-muted-foreground">{selectedAdoption.pets?.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-medium">{selectedAdoption.profile?.full_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedAdoption.profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedAdoption.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedAdoption.address || "N/A"}</p>
                  </div>
                </div>

                {selectedAdoption.message && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Message</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">{selectedAdoption.message}</p>
                  </div>
                )}

                <div className="pt-4 border-t flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedAdoption.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : selectedAdoption.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedAdoption.status}
                  </span>
                  
                  {selectedAdoption.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          updateStatus(selectedAdoption.id, 'rejected');
                          setDetailsOpen(false);
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          updateStatus(selectedAdoption.id, 'approved', selectedAdoption.pet_id);
                          setDetailsOpen(false);
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdoptionsManagement;
