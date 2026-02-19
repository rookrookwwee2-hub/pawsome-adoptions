import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Bell,
  Home,
  Trash2,
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { EmailPreferences } from "@/components/account/EmailPreferences";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";
import { FosterApplicationsTab } from "@/components/account/FosterApplicationsTab";
import { useTranslation } from "react-i18next";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileSchema = z.object({
    full_name: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
  });

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(6, t("auth.passwordMin")),
      newPassword: z.string().min(6, t("auth.passwordMin")),
      confirmPassword: z.string().min(6, t("auth.passwordMin")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("account.passwordMatch"),
      path: ["confirmPassword"],
    });

  type ProfileFormData = z.infer<typeof profileSchema>;
  type PasswordFormData = z.infer<typeof passwordSchema>;

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
      toast.success(t("account.profileUpdated"));
    } catch (error) {
      toast.error(t("account.profileFailed"));
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
      toast.success(t("account.passwordUpdated"));
    } catch (error: any) {
      toast.error(error.message || t("account.passwordFailed"));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarChange = (url: string) => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const handleAccountDeleted = () => {
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" /> {t("account.pending")}
          </Badge>
        );
      case "approved":
      case "confirmed":
        return (
          <Badge className="bg-primary/10 text-primary gap-1">
            <Check className="w-3 h-3" /> {status === "approved" ? t("account.approved") : t("account.confirmed")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" /> {t("account.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("account.pageTitle")}</title>
        <meta name="description" content="Manage your Pawsfam account settings, profile, and view your adoption history." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom max-w-4xl">
            <h1 className="font-display text-4xl font-bold mb-8">{t("account.title")}</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.profile")}</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.passwordTab")}</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.emails")}</span>
                </TabsTrigger>
                <TabsTrigger value="adoptions" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.adoptions")}</span>
                </TabsTrigger>
                <TabsTrigger value="foster" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.fosterTab")}</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("account.payments")}</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.profileInfo")}</CardTitle>
                    <CardDescription>
                      {t("account.updatePersonal")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <AvatarUpload
                          userId={user.id}
                          currentAvatarUrl={profile?.avatar_url}
                          userName={profile?.full_name}
                          onAvatarChange={handleAvatarChange}
                        />

                        <Separator />

                        <Form {...profileForm}>
                          <form
                            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <FormLabel>{t("account.emailLabel")}</FormLabel>
                              <Input value={user.email || ""} disabled />
                              <p className="text-xs text-muted-foreground">
                                {t("account.emailNoChange")}
                              </p>
                            </div>

                            <FormField
                              control={profileForm.control}
                              name="full_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("account.fullName")}</FormLabel>
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
                                  <FormLabel>{t("account.phone")}</FormLabel>
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
                                  {t("account.saving")}
                                </>
                              ) : (
                                t("account.saveChanges")
                              )}
                            </Button>
                          </form>
                        </Form>

                        <Separator />

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
                              <Trash2 className="w-5 h-5" />
                              {t("account.dangerZone")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t("account.dangerDesc")}
                            </p>
                          </div>
                          <DeleteAccountDialog
                            userEmail={user.email || ""}
                            onDeleted={handleAccountDeleted}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.changePassword")}</CardTitle>
                    <CardDescription>
                      {t("account.updatePassword")}
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
                              <FormLabel>{t("account.currentPassword")}</FormLabel>
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
                              <FormLabel>{t("account.newPassword")}</FormLabel>
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
                              <FormLabel>{t("account.confirmPassword")}</FormLabel>
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
                              {t("account.updating")}
                            </>
                          ) : (
                            t("account.updatePasswordBtn")
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <EmailPreferences
                  userId={user.id}
                  adoptionUpdates={profile?.email_adoption_updates ?? true}
                  newsletters={profile?.email_newsletters ?? true}
                  promotions={profile?.email_promotions ?? false}
                  onUpdate={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}
                />
              </TabsContent>

              {/* Adoptions Tab */}
              <TabsContent value="adoptions">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.adoptionHistory")}</CardTitle>
                    <CardDescription>
                      {t("account.adoptionHistoryDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {adoptionsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : adoptions?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {t("account.noAdoptions")}
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
                                {adoption.pets?.name || t("account.unknownPet")}
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

              {/* Foster Tab */}
              <TabsContent value="foster">
                <FosterApplicationsTab userId={user.id} />
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.paymentHistory")}</CardTitle>
                    <CardDescription>
                      {t("account.paymentHistoryDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : payments?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {t("account.noPayments")}
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
                                {payment.pets?.name || t("account.unknownPet")}
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
