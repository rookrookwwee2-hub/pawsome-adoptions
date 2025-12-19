import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbPet = Database["public"]["Tables"]["pets"]["Row"];

export type PetCardModel = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  fee: number;
};

export type PetDetailsModel = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  location: string;
  description: string;
  fee: number;
  images: string[];
  status: "available" | "pending" | "adopted";
  vaccinated: boolean;
  neutered: boolean;
  goodWith: string[];
  personality: string[];
};

const FALLBACK_IMAGE = "/placeholder.svg";

export function mapDbPetToPetCard(pet: DbPet): PetCardModel {
  return {
    id: pet.id,
    name: pet.name,
    type: pet.type,
    breed: pet.breed ?? "Unknown breed",
    age: pet.age ?? "Unknown age",
    location: pet.location ?? "",
    image: pet.image_url ?? FALLBACK_IMAGE,
    fee: Number(pet.adoption_fee ?? 0),
  };
}

export function mapDbPetToPetDetails(pet: DbPet): PetDetailsModel {
  const imagesFromDb = Array.isArray(pet.images) ? pet.images.filter(Boolean) : [];
  const images = imagesFromDb.length
    ? imagesFromDb
    : [pet.image_url ?? FALLBACK_IMAGE];

  const goodWith: string[] = [];
  if (pet.good_with_kids) goodWith.push("Kids");
  if (pet.good_with_pets) goodWith.push("Other pets");

  return {
    id: pet.id,
    name: pet.name,
    type: pet.type,
    breed: pet.breed ?? "Unknown breed",
    age: pet.age ?? "Unknown age",
    gender: pet.gender ?? "",
    size: pet.size ?? "",
    location: pet.location ?? "",
    description: pet.description ?? "",
    fee: Number(pet.adoption_fee ?? 0),
    images,
    status: pet.status ?? "available",
    vaccinated: Boolean(pet.vaccinated),
    neutered: Boolean(pet.neutered),
    goodWith,
    personality: [],
  };
}

export function usePublicPets(options?: { limit?: number }) {
  return useQuery({
    queryKey: ["publicPets", options?.limit ?? null],
    queryFn: async () => {
      let query = supabase
        .from("pets")
        .select("*")
        .neq("status", "adopted")
        .order("created_at", { ascending: false });

      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as DbPet[];
    },
  });
}

export function usePublicPet(petId?: string) {
  return useQuery({
    queryKey: ["publicPet", petId ?? null],
    enabled: Boolean(petId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId as string)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as DbPet | null;
    },
  });
}

export function formatPetStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
