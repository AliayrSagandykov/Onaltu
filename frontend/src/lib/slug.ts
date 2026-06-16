const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
  ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ә: 'a', ғ: 'g', қ: 'q', ң: 'ng', ө: 'o', ұ: 'u', ү: 'u',
  һ: 'h', і: 'i',
};

export function slugify(input: string): string {
  const lower = (input || '').toLowerCase().normalize('NFC');
  const transliterated = Array.from(lower)
    .map((ch) => (CYRILLIC_TO_LATIN[ch] !== undefined ? CYRILLIC_TO_LATIN[ch] : ch))
    .join('');
  const cleaned = transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || 'article';
}

export function slugCandidates(rawSlug: string): string[] {
  const out = new Set<string>();
  const push = (s: string | undefined | null) => {
    if (typeof s === 'string' && s.length > 0) out.add(s);
  };

  push(rawSlug);
  try {
    push(decodeURIComponent(rawSlug));
  } catch {
    /* malformed encoding, skip */
  }
  for (const s of Array.from(out)) {
    try {
      push(s.normalize('NFC'));
      push(s.normalize('NFD'));
    } catch {
      /* normalization unsupported */
    }
    push(s.toLowerCase());
  }
  return Array.from(out);
}
