import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import { catBreeds, dogBreeds } from "@/data/breeds";

type Pet = Database['public']['Tables']['pets']['Row'];
type PetInsert = Database['public']['Tables']['pets']['Insert'];

const defaultPet: PetInsert = {
  name: "",
  type: "Cat",
  breed: "",
  age: "",
  size: "Medium",
  gender: "Male",
  location: "",
  description: "",
  adoption_fee: 0,
  status: "available",
  image_url: "",
  vaccinated: false,
  neutered: false,
  microchipped: false,
  house_trained: false,
  good_with_kids: false,
  good_with_pets: false,
  delivery_type: "pickup_or_delivery",
  delivery_notes: "",
  // New health badge fields
  fiv_felv_negative: false,
  fvrcp_vaccine: false,
  rabies_vaccine: false,
  health_certificate: false,
  pet_passport: false,
  dewormed: false,
  genetic_health_guarantee: true,
  genetic_health_years: 1,
  // New info fields
  video_url: "",
  birth_date: null,
  weight: null,
  // Travel pricing
  flight_nanny_price: 1500,
  air_cargo_usa_price: 600,
  air_cargo_canada_price: 950,
  ground_transport_price: 50,
};

const PetsManagement = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetInsert>(defaultPet);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pets:', error);
    } else {
      setPets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get breeds based on selected type
  const getBreedOptions = () => {
    if (formData.type === "Cat") {
      return catBreeds.map((b) => b.name);
    } else if (formData.type === "Dog") {
      return dogBreeds.map((b) => b.name);
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const petData = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed || null,
      age: formData.age || null,
      size: formData.size || null,
      gender: formData.gender || null,
      location: formData.location || null,
      description: formData.description || null,
      adoption_fee: formData.adoption_fee || 0,
      status: formData.status || "available",
      image_url: formData.image_url || null,
      vaccinated: formData.vaccinated || false,
      neutered: formData.neutered || false,
      microchipped: formData.microchipped || false,
      house_trained: formData.house_trained || false,
      good_with_kids: formData.good_with_kids || false,
      good_with_pets: formData.good_with_pets || false,
      delivery_type: formData.delivery_type || "pickup_or_delivery",
      delivery_notes: formData.delivery_notes || null,
      // New fields
      fiv_felv_negative: formData.fiv_felv_negative || false,
      fvrcp_vaccine: formData.fvrcp_vaccine || false,
      rabies_vaccine: formData.rabies_vaccine || false,
      health_certificate: formData.health_certificate || false,
      pet_passport: formData.pet_passport || false,
      dewormed: formData.dewormed || false,
      genetic_health_guarantee: formData.genetic_health_guarantee ?? true,
      genetic_health_years: formData.genetic_health_years || 1,
      video_url: formData.video_url || null,
      birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
      weight: formData.weight || null,
      flight_nanny_price: formData.flight_nanny_price || 1500,
      air_cargo_usa_price: formData.air_cargo_usa_price || 600,
      air_cargo_canada_price: formData.air_cargo_canada_price || 950,
      ground_transport_price: formData.ground_transport_price || 50,
    };

    try {
      if (editingPet) {
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', editingPet.id);

        if (error) {
          console.error('Update error:', error);
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Success", description: "Pet updated successfully" });
          fetchPets();
          setDialogOpen(false);
          setFormData(defaultPet);
          setBirthDate(undefined);
        }
      } else {
        const { error } = await supabase.from('pets').insert(petData);

        if (error) {
          console.error('Insert error:', error);
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Success", description: "Pet added successfully" });
          fetchPets();
          setDialogOpen(false);
          setFormData(defaultPet);
          setBirthDate(undefined);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;

    const { error } = await supabase.from('pets').delete().eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Pet deleted successfully" });
      fetchPets();
    }
  };

  const openEditDialog = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || "",
      age: pet.age || "",
      size: pet.size || "Medium",
      gender: pet.gender || "Male",
      location: pet.location || "",
      description: pet.description || "",
      adoption_fee: pet.adoption_fee || 0,
      status: pet.status || "available",
      image_url: pet.image_url || "",
      vaccinated: pet.vaccinated || false,
      neutered: pet.neutered || false,
      microchipped: pet.microchipped || false,
      house_trained: pet.house_trained || false,
      good_with_kids: pet.good_with_kids || false,
      good_with_pets: pet.good_with_pets || false,
      delivery_type: pet.delivery_type || "pickup_or_delivery",
      delivery_notes: pet.delivery_notes || "",
      // New fields
      fiv_felv_negative: pet.fiv_felv_negative || false,
      fvrcp_vaccine: pet.fvrcp_vaccine || false,
      rabies_vaccine: pet.rabies_vaccine || false,
      health_certificate: pet.health_certificate || false,
      pet_passport: pet.pet_passport || false,
      dewormed: pet.dewormed || false,
      genetic_health_guarantee: pet.genetic_health_guarantee ?? true,
      genetic_health_years: pet.genetic_health_years || 1,
      video_url: pet.video_url || "",
      birth_date: pet.birth_date || null,
      weight: pet.weight || null,
      flight_nanny_price: pet.flight_nanny_price || 1500,
      air_cargo_usa_price: pet.air_cargo_usa_price || 600,
      air_cargo_canada_price: pet.air_cargo_canada_price || 950,
      ground_transport_price: pet.ground_transport_price || 50,
    });
    setBirthDate(pet.birth_date ? new Date(pet.birth_date) : undefined);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPet(null);
    setFormData(defaultPet);
    setBirthDate(undefined);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Pets Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, and manage pets available for adoption
            </p>
          </div>
          <Button onClick={openAddDialog} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? "Edit Pet" : "Add New Pet"}
                </DialogTitle>
                <DialogDescription>
                  Public pages show pets that are not marked as "Adopted".
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value, breed: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      {(formData.type === "Cat" || formData.type === "Dog") ? (
                        <Select
                          value={formData.breed || ""}
                          onValueChange={(value) => setFormData({ ...formData, breed: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select breed" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {getBreedOptions().map((breed) => (
                              <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="breed"
                          value={formData.breed || ""}
                          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={formData.age || ""}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="e.g., 2 years"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Select
                        value={formData.size || "Medium"}
                        onValueChange={(value) => setFormData({ ...formData, size: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender || "Male"}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight || ""}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="e.g., 8.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status || "available"}
                        onValueChange={(value: "available" | "pending" | "adopted") => 
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="adopted">Adopted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Birth Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !birthDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? format(birthDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adoption_fee">Adoption Fee ($)</Label>
                    <Input
                      id="adoption_fee"
                      type="number"
                      value={formData.adoption_fee || 0}
                      onChange={(e) => setFormData({ ...formData, adoption_fee: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Media</h3>
                  <ImageUpload
                    value={formData.image_url || null}
                    onChange={(url) => setFormData({ ...formData, image_url: url || "" })}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL (YouTube, Vimeo, etc.)</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url || ""}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Basic Traits */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Traits & Behavior</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'house_trained', label: 'House Trained' },
                      { key: 'good_with_kids', label: 'Good with Kids' },
                      { key: 'good_with_pets', label: 'Good with Pets' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Checkbox
                          id={item.key}
                          checked={formData[item.key as keyof PetInsert] as boolean}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, [item.key]: checked })
                          }
                        />
                        <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Badges Section */}
                <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <h3 className="font-semibold text-sm text-green-700 dark:text-green-400 uppercase tracking-wide">Health & Vaccinations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'vaccinated', label: 'General Vaccinations' },
                      { key: 'fvrcp_vaccine', label: 'FVRCP Vaccine' },
                      { key: 'rabies_vaccine', label: 'Rabies Shot' },
                      { key: 'fiv_felv_negative', label: 'FIV/FeLV Negative' },
                      { key: 'neutered', label: 'Spayed/Neutered' },
                      { key: 'microchipped', label: 'Microchipped' },
                      { key: 'dewormed', label: 'Dewormed' },
                      { key: 'health_certificate', label: 'Health Certificate' },
                      { key: 'pet_passport', label: 'Pet Passport' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Checkbox
                          id={item.key}
                          checked={formData[item.key as keyof PetInsert] as boolean}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, [item.key]: checked })
                          }
                        />
                        <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="genetic_health_guarantee"
                        checked={formData.genetic_health_guarantee as boolean}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, genetic_health_guarantee: checked as boolean })
                        }
                      />
                      <Label htmlFor="genetic_health_guarantee" className="text-sm">Genetic Health Guarantee</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genetic_health_years" className="text-sm">Guarantee Years</Label>
                      <Select
                        value={String(formData.genetic_health_years || 1)}
                        onValueChange={(value) => setFormData({ ...formData, genetic_health_years: parseInt(value) })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Year</SelectItem>
                          <SelectItem value="2">2 Years</SelectItem>
                          <SelectItem value="3">3 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Travel Pricing Section */}
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400 uppercase tracking-wide">Travel & Delivery Pricing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ground_transport_price" className="text-sm">Ground ($)</Label>
                      <Input
                        id="ground_transport_price"
                        type="number"
                        value={formData.ground_transport_price || 50}
                        onChange={(e) => setFormData({ ...formData, ground_transport_price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="air_cargo_usa_price" className="text-sm">Air USA ($)</Label>
                      <Input
                        id="air_cargo_usa_price"
                        type="number"
                        value={formData.air_cargo_usa_price || 600}
                        onChange={(e) => setFormData({ ...formData, air_cargo_usa_price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="air_cargo_canada_price" className="text-sm">Air Canada ($)</Label>
                      <Input
                        id="air_cargo_canada_price"
                        type="number"
                        value={formData.air_cargo_canada_price || 950}
                        onChange={(e) => setFormData({ ...formData, air_cargo_canada_price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flight_nanny_price" className="text-sm">Flight Nanny ($)</Label>
                      <Input
                        id="flight_nanny_price"
                        type="number"
                        value={formData.flight_nanny_price || 1500}
                        onChange={(e) => setFormData({ ...formData, flight_nanny_price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery & Pickup Options */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Delivery & Pickup Options</h3>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_type">Delivery Type</Label>
                    <Select
                      value={formData.delivery_type || "pickup_or_delivery"}
                      onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup_only">Local Pickup Only</SelectItem>
                        <SelectItem value="delivery_only">Delivery Available</SelectItem>
                        <SelectItem value="pickup_or_delivery">Pickup or Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_notes">Delivery Notes (optional)</Label>
                    <Textarea
                      id="delivery_notes"
                      value={formData.delivery_notes || ""}
                      onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                      rows={2}
                      placeholder="e.g., Additional delivery fees may apply for distances over 50 miles..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPet ? "Update Pet" : "Add Pet"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search pets by name, type, or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Loading pets...
                  </TableCell>
                </TableRow>
              ) : filteredPets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No pets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      {pet.image_url ? (
                        <img 
                          src={pet.image_url} 
                          alt={pet.name} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.type}</TableCell>
                    <TableCell>{pet.breed || "-"}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        pet.status === "available" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        pet.status === "pending" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        pet.status === "adopted" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      )}>
                        {pet.status}
                      </span>
                    </TableCell>
                    <TableCell>${pet.adoption_fee || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(pet)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pet.id)}
                          className="text-destructive hover:text-destructive"
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
    </AdminLayout>
  );
};

export default PetsManagement;
