import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
}

const SUPABASE_URL = "https://wipmmmlndhvsozrpepyt.supabase.co";

export default function ImageUpload({
  value,
  onChange,
  bucket = "pet-images",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError(uploadError.message);
        return;
      }

      // Construct public URL
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
      onChange(publicUrl);
    } catch (err: unknown) {
      console.error("Unexpected upload error:", err);
      setError("Unexpected error during upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <Label>Pet Image</Label>

      {value ? (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt="Pet preview"
            className="w-full aspect-square object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : "Click to upload image"}
          </span>
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
