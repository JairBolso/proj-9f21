"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EXTENSOES_VIDEO = [".mp4", ".webm", ".mov", ".m4v"];

function ehVideo(url: string) {
  const semQuery = url.split("?")[0].toLowerCase();
  return EXTENSOES_VIDEO.some((ext) => semQuery.endsWith(ext));
}

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
  const [colandoLink, setColandoLink] = useState(false);
  const [link, setLink] = useState("");
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
          {ehVideo(value) ? (
            <video src={value} muted loop className="w-full h-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/70 text-admin-text p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
        </div>
      ) : colandoLink ? (
        <div className={`w-full ${aspectClassName} border border-dashed border-admin-borderInput flex flex-col items-center justify-center gap-2 px-4`}>
          <input
            autoFocus
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && link.trim()) onChange(link.trim());
            }}
            placeholder="Cole o link do vídeo ou imagem (ex: Cloudflare R2)"
            className="w-full max-w-[360px] bg-admin-input border border-admin-borderInput px-3 py-2 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
          <div className="flex gap-3 text-[11px] uppercase tracking-[.06em]">
            <button
              type="button"
              disabled={!link.trim()}
              onClick={() => link.trim() && onChange(link.trim())}
              className="text-admin-accent disabled:opacity-40"
            >
              Usar link
            </button>
            <button
              type="button"
              onClick={() => {
                setColandoLink(false);
                setLink("");
              }}
              className="text-admin-textFaint hover:text-admin-text"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className={`w-full ${aspectClassName} border border-dashed border-admin-borderInput flex items-center justify-center gap-3 text-admin-textFaint`}>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            title="Enviar arquivo de imagem"
            className="p-2 hover:text-admin-accent transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <ImagePlus size={22} strokeWidth={1.6} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setColandoLink(true)}
            title="Colar link (vídeo ou imagem)"
            className="p-2 hover:text-admin-accent transition-colors"
          >
            <LinkIcon size={20} strokeWidth={1.6} />
          </button>
        </div>
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
