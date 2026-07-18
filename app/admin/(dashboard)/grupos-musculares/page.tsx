import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { GruposMuscularesManager } from "@/components/admin/grupos/GruposMuscularesManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Grupos Musculares" };

export default async function GruposMuscularesPage() {
  const supabase = await createClient();
  const { data: grupos } = await supabase
    .from("grupos_musculares")
    .select("id, nome")
    .order("nome");

  return (
    <div>
      <PageHeader
        title="Grupos Musculares"
        subtitle="Usados na ficha técnica dos produtos"
      />
      <GruposMuscularesManager grupos={grupos ?? []} />
    </div>
  );
}
