import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, X, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  maxImages?: number;
}

const SUPABASE_URL = "https://wipmmmlndhvsozrpepyt.supabase.co";

export default function MultiImageUpload({
  values,
  onChange,
  bucket = "pet-images",
  maxImages = 10,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - values.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate all files
    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("Each image must be smaller than 50 MB.");
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError(uploadError.message);
          continue;
        }

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onChange([...values, ...uploadedUrls]);
      }
    } catch (err: unknown) {
      console.error("Unexpected upload error:", err);
      setError("Unexpected error during upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  }

  function handleSetPrimary(index: number) {
    if (index === 0) return;
    const newValues = [...values];
    const [removed] = newValues.splice(index, 1);
    newValues.unshift(removed);
    onChange(newValues);
  }

  return (
    <div className="space-y-3">
      <Label>Pet Images ({values.length}/{maxImages})</Label>

      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {values.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Pet image ${index + 1}`}
                className={`w-full aspect-square object-cover rounded-lg border-2 ${
                  index === 0 ? "border-primary" : "border-border"
                }`}
              />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  Primary
                </span>
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => handleSetPrimary(index)}
                    title="Set as primary"
                  >
                    <GripVertical className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => handleRemove(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {values.length < maxImages && (
        <div
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground text-center">
            {uploading ? "Uploading…" : "Click to upload images (max 50 MB each)"}
          </span>
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
