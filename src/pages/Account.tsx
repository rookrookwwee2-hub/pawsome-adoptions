import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  FileText,
  Wallet,
  Loader2,
  Check,
  Clock,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const profileSchema = z.object({
  full_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Fetch profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch adoptions
  const { data: adoptions, isLoading: adoptionsLoading } = useQuery({
    queryKey: ["user-adoptions", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adoptions")
        .select("*, pets(name, type, image_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch guest payments by email
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["user-payments", user.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_payments")
        .select("*, pets(name, type)")
        .eq("guest_email", user.email)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name || null,
          phone: data.phone || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      passwordForm.reset();
      toast.success("Password updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "approved":
      case "confirmed":
        return (
          <Badge className="bg-primary/10 text-primary gap-1">
            <Check className="w-3 h-3" /> {status === "approved" ? "Approved" : "Confirmed"}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Settings | PawHaven</title>
        <meta name="description" content="Manage your PawHaven account settings, profile, and view your adoption history." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom max-w-4xl">
            <h1 className="font-display text-4xl font-bold mb-8">Account Settings</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Password</span>
                </TabsTrigger>
                <TabsTrigger value="adoptions" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Adoptions</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Payments</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <Form {...profileForm}>
                        <form
                          onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <Input value={user.email || ""} disabled />
                            <p className="text-xs text-muted-foreground">
                              Email cannot be changed
                            </p>
                          </div>

                          <FormField
                            control={profileForm.control}
                            name="full_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+1 (555) 123-4567"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="rounded-full"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="rounded-full"
                        >
                          {isUpdatingPassword ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Adoptions Tab */}
              <TabsContent value="adoptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Adoption History</CardTitle>
                    <CardDescription>
                      View your adoption requests and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {adoptionsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : adoptions?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        You haven't submitted any adoption requests yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {adoptions?.map((adoption: any) => (
                          <div
                            key={adoption.id}
                            className="flex items-center gap-4 p-4 bg-muted rounded-xl"
                          >
                            {adoption.pets?.image_url && (
                              <img
                                src={adoption.pets.image_url}
                                alt={adoption.pets.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">
                                {adoption.pets?.name || "Unknown Pet"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(adoption.created_at), "MMM d, yyyy")}
                              </p>
                            </div>
                            {getStatusBadge(adoption.status)}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                      View your USDT payment submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : payments?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        You haven't made any USDT payments yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {payments?.map((payment: any) => (
                          <div
                            key={payment.id}
                            className="flex items-center gap-4 p-4 bg-muted rounded-xl"
                          >
                            <div className="flex-1">
                              <p className="font-medium">
                                {payment.pets?.name || "Unknown Pet"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(payment.created_at), "MMM d, yyyy")}
                              </p>
                            </div>
                            <p className="font-medium text-primary">
                              ${payment.amount} USDT
                            </p>
                            {getStatusBadge(payment.status)}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Account;
