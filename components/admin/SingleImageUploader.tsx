"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SingleImageUploader({
  value,
  onChange,
  bucket,
  folder = "",
  aspectClassName = "aspect-video",
  helperText,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: string;
  folder?: string;
  aspectClassName?: string;
  helperText?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setErro(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder ? `${folder}/` : ""}${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      onChange(publicUrl);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao enviar imagem.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {erro && (
        <div className="mb-3 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[12px] px-3 py-2">
          {erro}
        </div>
      )}

      {value ? (
        <div className={`relative ${aspectClassName} bg-admin-input group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/70 text-admin-text p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`w-full ${aspectClassName} border border-dashed border-admin-borderInput flex items-center justify-center text-admin-textFaint hover:border-admin-accent hover:text-admin-accent transition-colors disabled:opacity-50`}
        >
          {uploading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <ImagePlus size={22} strokeWidth={1.6} />
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {helperText && (
        <p className="mt-1.5 text-[11px] text-admin-textFaint">{helperText}</p>
      )}
    </div>
  );
}
