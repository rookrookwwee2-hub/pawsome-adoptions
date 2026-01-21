import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Wallet, Building2, UserPlus, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import PayPalSettings from "@/components/admin/PayPalSettings";

interface UsdtSettings {
  network: string;
  walletAddress: string;
  note: string;
}

interface BankDetail {
  label: string;
  value: string;
}

interface BankSettings {
  id: string;
  region: string;
  subtitle: string;
  currency: string;
  details: BankDetail[];
}

const SettingsManagement = () => {
  const [usdtSettings, setUsdtSettings] = useState<UsdtSettings>({
    network: "",
    walletAddress: "",
    note: "",
  });
  const [bankSettings, setBankSettings] = useState<BankSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*");

    if (error) {
      console.error("Error fetching settings:", error);
      toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data) {
      const usdtData = data.find((s) => s.setting_key === "usdt");
      const bankData = data.find((s) => s.setting_key === "bank_details");

      if (usdtData) {
        setUsdtSettings(usdtData.setting_value as unknown as UsdtSettings);
      }
      if (bankData) {
        setBankSettings(bankData.setting_value as unknown as BankSettings[]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveUsdtSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .update({ setting_value: usdtSettings as unknown as never })
      .eq("setting_key", "usdt");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "USDT settings saved successfully" });
    }
    setSaving(false);
  };

  const saveBankSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .update({ setting_value: bankSettings as unknown as never })
      .eq("setting_key", "bank_details");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Bank settings saved successfully" });
    }
    setSaving(false);
  };

  const updateBankDetail = (bankIndex: number, detailIndex: number, value: string) => {
    const updated = [...bankSettings];
    updated[bankIndex].details[detailIndex].value = value;
    setBankSettings(updated);
  };

  const addBankDetail = (bankIndex: number) => {
    const updated = [...bankSettings];
    updated[bankIndex].details.push({ label: "New Field", value: "" });
    setBankSettings(updated);
  };

  const removeBankDetail = (bankIndex: number, detailIndex: number) => {
    const updated = [...bankSettings];
    updated[bankIndex].details.splice(detailIndex, 1);
    setBankSettings(updated);
  };

  const updateBankDetailLabel = (bankIndex: number, detailIndex: number, label: string) => {
    const updated = [...bankSettings];
    updated[bankIndex].details[detailIndex].label = label;
    setBankSettings(updated);
  };

  const createAdminAccount = async () => {
    if (!newAdminEmail.trim()) {
      toast({ title: "Error", description: "Please enter an email address", variant: "destructive" });
      return;
    }

    setCreatingAdmin(true);

    // First check if user already exists in profiles
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", newAdminEmail.toLowerCase())
      .maybeSingle();

    if (profileError) {
      toast({ title: "Error", description: profileError.message, variant: "destructive" });
      setCreatingAdmin(false);
      return;
    }

    if (existingProfile) {
      // User exists, check if already admin
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", existingProfile.id)
        .eq("role", "admin")
        .maybeSingle();

      if (existingRole) {
        toast({ title: "Info", description: "This user is already an admin" });
        setCreatingAdmin(false);
        setNewAdminEmail("");
        return;
      }

      // Add admin role to existing user
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: existingProfile.id, role: "admin" });

      if (roleError) {
        toast({ title: "Error", description: roleError.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: `Admin role granted to ${newAdminEmail}` });
        setNewAdminEmail("");
      }
    } else {
      // User doesn't exist - create invitation note
      toast({ 
        title: "User Not Found", 
        description: `No account found for ${newAdminEmail}. Ask them to sign up first, then you can grant admin access from the Users page.`,
        variant: "destructive"
      });
    }

    setCreatingAdmin(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage payment methods and admin accounts
          </p>
        </div>

        <Tabs defaultValue="usdt" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="usdt" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              USDT
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Banks
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              PayPal
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Admins
            </TabsTrigger>
          </TabsList>

          {/* USDT Settings */}
          <TabsContent value="usdt">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  USDT Payment Settings
                </CardTitle>
                <CardDescription>
                  Configure the USDT wallet address and network for receiving payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Input
                    id="network"
                    value={usdtSettings.network}
                    onChange={(e) => setUsdtSettings({ ...usdtSettings, network: e.target.value })}
                    placeholder="e.g., TRC20 (Tron)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={usdtSettings.walletAddress}
                    onChange={(e) => setUsdtSettings({ ...usdtSettings, walletAddress: e.target.value })}
                    placeholder="Enter USDT wallet address"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Warning Note</Label>
                  <Textarea
                    id="note"
                    value={usdtSettings.note}
                    onChange={(e) => setUsdtSettings({ ...usdtSettings, note: e.target.value })}
                    placeholder="Warning message for users"
                    rows={3}
                  />
                </div>
                <Button onClick={saveUsdtSettings} disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save USDT Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Settings */}
          <TabsContent value="bank">
            <div className="space-y-6">
              {bankSettings.map((bank, bankIndex) => (
                <Card key={bank.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {bank.region}
                    </CardTitle>
                    <CardDescription>
                      {bank.subtitle} - {bank.currency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bank.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label>Field Label</Label>
                          <Input
                            value={detail.label}
                            onChange={(e) => updateBankDetailLabel(bankIndex, detailIndex, e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>Value</Label>
                          <Input
                            value={detail.value}
                            onChange={(e) => updateBankDetail(bankIndex, detailIndex, e.target.value)}
                            className="font-mono"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBankDetail(bankIndex, detailIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBankDetail(bankIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={saveBankSettings} disabled={saving} className="w-full sm:w-auto">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Bank Settings
              </Button>
            </div>
          </TabsContent>

          {/* PayPal Settings */}
          <TabsContent value="paypal">
            <PayPalSettings />
          </TabsContent>

          {/* Admin Accounts */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Admin Account
                </CardTitle>
                <CardDescription>
                  Grant admin privileges to an existing user by their email address.
                  The user must have an account on the platform first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">User Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Enter user's email address"
                  />
                </div>
                <Button onClick={createAdminAccount} disabled={creatingAdmin}>
                  {creatingAdmin ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Grant Admin Access
                </Button>
                <p className="text-sm text-muted-foreground">
                  Note: You can also manage admin roles from the Users page by clicking "Make Admin" on any user.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsManagement;
