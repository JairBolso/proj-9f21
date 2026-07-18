"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function salvarIntegracoes(input: {
  id?: string;
  meta_pixel_id: string;
  gtm_id: string;
  scripts_custom: string;
}) {
  const supabase = await createClient();

  const payload = {
    meta_pixel_id: input.meta_pixel_id || null,
    gtm_id: input.gtm_id || null,
    scripts_custom: input.scripts_custom || null,
  };

  const { error } = input.id
    ? await supabase.from("integracoes").update(payload).eq("id", input.id)
    : await supabase.from("integracoes").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
}
