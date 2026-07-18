"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function FotosUploader({
  fotos,
  onChange,
}: {
  fotos: string[];
  onChange: (fotos: string[]) => void;
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
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("produtos").getPublicUrl(path);

      onChange([...fotos, publicUrl]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao enviar foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    onChange(fotos.filter((_, i) => i !== index));
  }

  const slots = [...fotos, ...Array(Math.max(0, 4 - fotos.length)).fill(null)].slice(
    0,
    Math.max(4, fotos.length),
  );

  return (
    <div>
      {erro && (
        <div className="mb-3 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[12px] px-3 py-2">
          {erro}
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {slots.map((foto, i) =>
          foto ? (
            <div key={foto} className="relative aspect-square bg-admin-input group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-admin-accent text-r3-black text-[10px] font-mono font-bold uppercase px-1.5 py-0.5">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1.5 right-1.5 bg-black/70 text-admin-text p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={13} strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              key={`empty-${i}`}
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="aspect-square border border-dashed border-admin-borderInput flex items-center justify-center text-admin-textFaint hover:border-admin-accent hover:text-admin-accent transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ImagePlus size={20} strokeWidth={1.6} />
              )}
            </button>
          ),
        )}
      </div>
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
    </div>
  );
}
