import { useState } from "react";
import {
  Key,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApiSecrets, type ApiSecret } from "@/hooks/useApiSecrets";

const COMMON_API_KEYS = [
  { name: "RESEND_API_KEY", description: "Resend API key for sending emails" },
  { name: "STRIPE_SECRET_KEY", description: "Stripe secret key for payment processing" },
  { name: "STRIPE_PUBLISHABLE_KEY", description: "Stripe publishable key (client-side)" },
  { name: "OPENAI_API_KEY", description: "OpenAI API key for AI features" },
  { name: "TWILIO_ACCOUNT_SID", description: "Twilio Account SID for SMS" },
  { name: "TWILIO_AUTH_TOKEN", description: "Twilio Auth Token for SMS" },
];

const ApiSecretsManager = () => {
  const { secrets, loading, addSecret, updateSecret, toggleSecret, deleteSecret } =
    useApiSecrets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<ApiSecret | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Form state for new secret
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Form state for edit
  const [editKeyValue, setEditKeyValue] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleAddSecret = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;

    setSaving(true);
    const success = await addSecret(newKeyName.trim(), newKeyValue.trim(), newDescription.trim());
    setSaving(false);

    if (success) {
      setIsAddDialogOpen(false);
      setNewKeyName("");
      setNewKeyValue("");
      setNewDescription("");
    }
  };

  const handleUpdateSecret = async () => {
    if (!selectedSecret) return;

    setSaving(true);
    const updates: Partial<Pick<ApiSecret, "key_value" | "description">> = {};
    
    if (editKeyValue.trim()) {
      updates.key_value = editKeyValue.trim();
    }
    updates.description = editDescription.trim() || null;

    const success = await updateSecret(selectedSecret.id, updates);
    setSaving(false);

    if (success) {
      setIsEditDialogOpen(false);
      setSelectedSecret(null);
      setEditKeyValue("");
      setEditDescription("");
    }
  };

  const handleToggle = async (secret: ApiSecret) => {
    await toggleSecret(secret.id, !secret.is_enabled);
  };

  const handleDelete = async (id: string) => {
    await deleteSecret(id);
  };

  const openEditDialog = (secret: ApiSecret) => {
    setSelectedSecret(secret);
    setEditKeyValue("");
    setEditDescription(secret.description || "");
    setIsEditDialogOpen(true);
  };

  const toggleShowValue = (id: string) => {
    setShowValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return "••••••••";
    return value.slice(0, 4) + "••••••••" + value.slice(-4);
  };

  const selectCommonKey = (key: { name: string; description: string }) => {
    setNewKeyName(key.name);
    setNewDescription(key.description);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            <CardTitle>API Keys & Secrets</CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  Add a new API key or secret. It will be stored securely and can be
                  enabled/disabled at any time.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick Select (Common Keys)</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_API_KEYS.filter(
                      (k) => !secrets.some((s) => s.key_name === k.name)
                    ).map((key) => (
                      <Badge
                        key={key.name}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => selectCommonKey(key)}
                      >
                        {key.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name *</Label>
                  <Input
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
                    placeholder="e.g., RESEND_API_KEY"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use UPPER_SNAKE_CASE format
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-value">Key Value *</Label>
                  <Input
                    id="key-value"
                    type="password"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    placeholder="Enter the secret key value"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-description">Description</Label>
                  <Textarea
                    id="key-description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What is this key used for?"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSecret}
                  disabled={saving || !newKeyName.trim() || !newKeyValue.trim()}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Add Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Manage API keys and secrets dynamically. Enable or disable integrations without
          code changes. All values are stored securely with Row Level Security.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {secrets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No API keys configured yet.</p>
            <p className="text-sm">Click "Add New Key" to get started.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secrets.map((secret) => (
                  <TableRow key={secret.id}>
                    <TableCell className="font-mono font-medium">
                      {secret.key_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showValues[secret.id]
                            ? secret.key_value
                            : maskValue(secret.key_value)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleShowValue(secret.id)}
                        >
                          {showValues[secret.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {secret.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {secret.is_enabled ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Disabled
                          </Badge>
                        )}
                        <Switch
                          checked={secret.is_enabled}
                          onCheckedChange={() => handleToggle(secret)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(secret)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{secret.key_name}</strong>? This action cannot be
                                undone and will break any integrations using this key.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(secret.id)}
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
          </div>
        )}

        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="text-sm text-amber-600 dark:text-amber-400">
              <p className="font-medium">Security Note</p>
              <p>
                API keys are stored with Row Level Security. Only admins can view or modify
                these values. For production, consider additional encryption layers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update the value or description for{" "}
              <strong>{selectedSecret?.key_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-key-value">New Key Value (leave empty to keep current)</Label>
              <Input
                id="edit-key-value"
                type="password"
                value={editKeyValue}
                onChange={(e) => setEditKeyValue(e.target.value)}
                placeholder="Enter new value or leave empty"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What is this key used for?"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSecret} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ApiSecretsManager;
