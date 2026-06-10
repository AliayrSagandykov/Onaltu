const LANG_MAP: Record<string, string> = {
  ru: 'ru',
  kz: 'kk',
  en: 'en',
};

export const SUPPORTED_LOCALES = ['ru', 'kz', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export async function translate(
  text: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<string> {
  if (!text || sourceLocale === targetLocale) return text;
  const sl = LANG_MAP[sourceLocale] || sourceLocale;
  const tl = LANG_MAP[targetLocale] || targetLocale;

  const chunks = chunkText(text, 4500);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`;
    const res = await fetch(url, {
      headers: {'User-Agent': 'Mozilla/5.0'},
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Translation HTTP ${res.status}`);
    const data = (await res.json()) as unknown;
    const segments = Array.isArray(data) && Array.isArray((data as unknown[])[0]) ? ((data as unknown[])[0] as unknown[]) : [];
    const out = segments
      .map((s) => (Array.isArray(s) && typeof s[0] === 'string' ? s[0] : ''))
      .join('');
    translatedChunks.push(out || chunk);
  }

  return translatedChunks.join('');
}

function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const result: string[] = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf('.', maxLen);
    if (cut < maxLen / 2) cut = remaining.lastIndexOf(' ', maxLen);
    if (cut < maxLen / 2) cut = maxLen;
    result.push(remaining.slice(0, cut + 1));
    remaining = remaining.slice(cut + 1);
  }
  if (remaining) result.push(remaining);
  return result;
}
