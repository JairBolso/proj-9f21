const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function extractUtmParams(
  searchParams: URLSearchParams,
): Record<string, string> | null {
  const entries = UTM_KEYS.map((key) => [key, searchParams.get(key)]).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}
