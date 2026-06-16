const LANG_MAP: Record<string, string> = {
  ru: 'ru',
  kz: 'kk',
  en: 'en',
};

export const SUPPORTED_LOCALES = ['ru', 'kz', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const REQUEST_TIMEOUT_MS = 15000;
const MAX_CHUNK = 3000;

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        ...(init.headers as Record<string, string> | undefined),
      },
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function callGoogle(text: string, sl: string, tl: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
  const data = (await res.json()) as unknown;
  const segments =
    Array.isArray(data) && Array.isArray((data as unknown[])[0])
      ? ((data as unknown[])[0] as unknown[])
      : [];
  const out = segments
    .map((s) => (Array.isArray(s) && typeof s[0] === 'string' ? s[0] : ''))
    .join('');
  return out;
}

export async function translate(
  text: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<string> {
  if (!text || sourceLocale === targetLocale) return text;
  const sl = LANG_MAP[sourceLocale] || sourceLocale;
  const tl = LANG_MAP[targetLocale] || targetLocale;

  const chunks = chunkText(text, MAX_CHUNK);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    let lastErr: unknown = null;
    let translated: string | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const out = await callGoogle(chunk, sl, tl);
        translated = out || chunk;
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        await new Promise((r) => setTimeout(r, 400 + attempt * 600));
      }
    }
    if (translated === null) {
      throw lastErr instanceof Error ? lastErr : new Error('Translation failed');
    }
    translatedChunks.push(translated);
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
