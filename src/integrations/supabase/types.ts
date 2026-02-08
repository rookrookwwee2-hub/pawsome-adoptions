export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      adoptions: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          message: string | null
          pet_id: string
          phone: string | null
          status: Database["public"]["Enums"]["adoption_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          pet_id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["adoption_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          pet_id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["adoption_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoptions_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_settings: {
        Row: {
          created_at: string
          ga_enabled: boolean
          ga_measurement_id: string | null
          gtm_container_id: string | null
          gtm_enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ga_enabled?: boolean
          ga_measurement_id?: string | null
          gtm_container_id?: string | null
          gtm_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ga_enabled?: boolean
          ga_measurement_id?: string | null
          gtm_container_id?: string | null
          gtm_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_secrets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          key_name: string
          key_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          key_name: string
          key_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          key_name?: string
          key_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string
          donation_type: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          id: string
          message: string | null
          proof_file_name: string | null
          proof_file_url: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string
          donation_type?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          id?: string
          message?: string | null
          proof_file_name?: string | null
          proof_file_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string
          donation_type?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          id?: string
          message?: string | null
          proof_file_name?: string | null
          proof_file_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      foster_applications: {
        Row: {
          address: string
          admin_notes: string | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          availability: string | null
          children_ages: string | null
          created_at: string
          experience: string | null
          has_children: boolean | null
          has_other_pets: boolean | null
          has_yard: boolean | null
          housing_type: string | null
          id: string
          other_pets_details: string | null
          preferred_pet_types: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          availability?: string | null
          children_ages?: string | null
          created_at?: string
          experience?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          housing_type?: string | null
          id?: string
          other_pets_details?: string | null
          preferred_pet_types?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string
          availability?: string | null
          children_ages?: string | null
          created_at?: string
          experience?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          housing_type?: string | null
          id?: string
          other_pets_details?: string | null
          preferred_pet_types?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      foster_assignments: {
        Row: {
          created_at: string
          end_date: string | null
          foster_application_id: string
          id: string
          notes: string | null
          pet_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          foster_application_id: string
          id?: string
          notes?: string | null
          pet_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          foster_application_id?: string
          id?: string
          notes?: string | null
          pet_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foster_assignments_foster_application_id_fkey"
            columns: ["foster_application_id"]
            isOneToOne: false
            referencedRelation: "foster_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foster_assignments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      google_oauth_settings: {
        Row: {
          client_id: string
          created_at: string
          default_user_role: Database["public"]["Enums"]["app_role"]
          enabled: boolean
          id: string
          redirect_uri: string
          scopes: string
          show_on_login: boolean
          updated_at: string
        }
        Insert: {
          client_id?: string
          created_at?: string
          default_user_role?: Database["public"]["Enums"]["app_role"]
          enabled?: boolean
          id?: string
          redirect_uri?: string
          scopes?: string
          show_on_login?: boolean
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          default_user_role?: Database["public"]["Enums"]["app_role"]
          enabled?: boolean
          id?: string
          redirect_uri?: string
          scopes?: string
          show_on_login?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ground_transport_settings: {
        Row: {
          base_price: number
          companion_base_fee: number
          companion_max_fee: number
          companion_per_km: number
          created_at: string
          estimated_speed_kmh: number
          id: string
          is_enabled: boolean
          max_ground_distance_km: number
          price_per_km: number
          price_per_mile: number
          private_multiplier: number
          standard_multiplier: number
          updated_at: string
        }
        Insert: {
          base_price?: number
          companion_base_fee?: number
          companion_max_fee?: number
          companion_per_km?: number
          created_at?: string
          estimated_speed_kmh?: number
          id?: string
          is_enabled?: boolean
          max_ground_distance_km?: number
          price_per_km?: number
          price_per_mile?: number
          private_multiplier?: number
          standard_multiplier?: number
          updated_at?: string
        }
        Update: {
          base_price?: number
          companion_base_fee?: number
          companion_max_fee?: number
          companion_per_km?: number
          created_at?: string
          estimated_speed_kmh?: number
          id?: string
          is_enabled?: boolean
          max_ground_distance_km?: number
          price_per_km?: number
          price_per_mile?: number
          private_multiplier?: number
          standard_multiplier?: number
          updated_at?: string
        }
        Relationships: []
      }
      guest_payments: {
        Row: {
          amount: number
          created_at: string
          guest_address: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          message: string | null
          pet_id: string
          status: string
          transaction_hash: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount: number
          created_at?: string
          guest_address?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          pet_id: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          created_at?: string
          guest_address?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          message?: string | null
          pet_id?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_payments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      payment_method_suggestions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          status: string
          suggested_method: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          status?: string
          suggested_method: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          status?: string
          suggested_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          admin_notes: string | null
          amount_sent: number
          created_at: string
          currency: string
          file_name: string | null
          file_url: string
          guest_email: string | null
          guest_name: string | null
          id: string
          payment_method: string
          pet_id: string | null
          status: string
          transaction_reference: string
          transfer_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount_sent: number
          created_at?: string
          currency?: string
          file_name?: string | null
          file_url: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          payment_method: string
          pet_id?: string | null
          status?: string
          transaction_reference: string
          transfer_date: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount_sent?: number
          created_at?: string
          currency?: string
          file_name?: string | null
          file_url?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          payment_method?: string
          pet_id?: string | null
          status?: string
          transaction_reference?: string
          transfer_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      pets: {
        Row: {
          adoption_fee: number | null
          age: string | null
          air_cargo_canada_price: number | null
          air_cargo_usa_price: number | null
          birth_date: string | null
          breed: string | null
          created_at: string | null
          delivery_notes: string | null
          delivery_type: string | null
          description: string | null
          dewormed: boolean | null
          fiv_felv_negative: boolean | null
          flight_nanny_price: number | null
          fvrcp_vaccine: boolean | null
          gender: string | null
          genetic_health_guarantee: boolean | null
          genetic_health_years: number | null
          good_with_kids: boolean | null
          good_with_pets: boolean | null
          ground_transport_price: number | null
          health_certificate: boolean | null
          house_trained: boolean | null
          id: string
          image_url: string | null
          images: string[] | null
          location: string | null
          location_country: string | null
          location_region: string | null
          microchipped: boolean | null
          name: string
          neutered: boolean | null
          pet_passport: boolean | null
          rabies_vaccine: boolean | null
          size: string | null
          status: Database["public"]["Enums"]["pet_status"] | null
          type: string
          updated_at: string | null
          vaccinated: boolean | null
          video_url: string | null
          weight: number | null
        }
        Insert: {
          adoption_fee?: number | null
          age?: string | null
          air_cargo_canada_price?: number | null
          air_cargo_usa_price?: number | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          delivery_type?: string | null
          description?: string | null
          dewormed?: boolean | null
          fiv_felv_negative?: boolean | null
          flight_nanny_price?: number | null
          fvrcp_vaccine?: boolean | null
          gender?: string | null
          genetic_health_guarantee?: boolean | null
          genetic_health_years?: number | null
          good_with_kids?: boolean | null
          good_with_pets?: boolean | null
          ground_transport_price?: number | null
          health_certificate?: boolean | null
          house_trained?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          location_country?: string | null
          location_region?: string | null
          microchipped?: boolean | null
          name: string
          neutered?: boolean | null
          pet_passport?: boolean | null
          rabies_vaccine?: boolean | null
          size?: string | null
          status?: Database["public"]["Enums"]["pet_status"] | null
          type: string
          updated_at?: string | null
          vaccinated?: boolean | null
          video_url?: string | null
          weight?: number | null
        }
        Update: {
          adoption_fee?: number | null
          age?: string | null
          air_cargo_canada_price?: number | null
          air_cargo_usa_price?: number | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          delivery_type?: string | null
          description?: string | null
          dewormed?: boolean | null
          fiv_felv_negative?: boolean | null
          flight_nanny_price?: number | null
          fvrcp_vaccine?: boolean | null
          gender?: string | null
          genetic_health_guarantee?: boolean | null
          genetic_health_years?: number | null
          good_with_kids?: boolean | null
          good_with_pets?: boolean | null
          ground_transport_price?: number | null
          health_certificate?: boolean | null
          house_trained?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          location_country?: string | null
          location_region?: string | null
          microchipped?: boolean | null
          name?: string
          neutered?: boolean | null
          pet_passport?: boolean | null
          rabies_vaccine?: boolean | null
          size?: string | null
          status?: Database["public"]["Enums"]["pet_status"] | null
          type?: string
          updated_at?: string | null
          vaccinated?: boolean | null
          video_url?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          email_adoption_updates: boolean | null
          email_newsletters: boolean | null
          email_promotions: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          email_adoption_updates?: boolean | null
          email_newsletters?: boolean | null
          email_promotions?: boolean | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          email_adoption_updates?: boolean | null
          email_newsletters?: boolean | null
          email_promotions?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_notes: string | null
          adoption_id: string | null
          country: string
          country_flag: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          display_location: string
          id: string
          pet_type: string
          photo_url: string | null
          review_text: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          adoption_id?: string | null
          country: string
          country_flag?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          display_location?: string
          id?: string
          pet_type: string
          photo_url?: string | null
          review_text: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          adoption_id?: string | null
          country?: string
          country_flag?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          display_location?: string
          id?: string
          pet_type?: string
          photo_url?: string | null
          review_text?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_adoption_id_fkey"
            columns: ["adoption_id"]
            isOneToOne: false
            referencedRelation: "adoptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          is_protected: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_protected?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_protected?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      adoption_status: "pending" | "approved" | "rejected"
      app_role: "admin" | "user"
      pet_status: "available" | "pending" | "adopted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      adoption_status: ["pending", "approved", "rejected"],
      app_role: ["admin", "user"],
      pet_status: ["available", "pending", "adopted"],
    },
  },
} as const
