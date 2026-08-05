const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_matchtype",
] as const;

export const UTM_LABELS: Record<string, string> = {
  utm_source: "Origem",
  utm_medium: "Mídia",
  utm_campaign: "Campanha",
  utm_term: "Termo buscado",
  utm_content: "Anúncio",
  utm_matchtype: "Tipo de correspondência",
};

export function extractUtmParams(
  searchParams: URLSearchParams,
): Record<string, string> | null {
  const entries = UTM_KEYS.map((key) => [key, searchParams.get(key)]).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}
