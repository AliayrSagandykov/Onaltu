import {prisma} from './prisma';

export async function getContent(key: string, locale: string, fallback: string): Promise<string> {
  try {
    const item = await prisma.pageContent.findUnique({
      where: {key_locale: {key, locale}},
    });
    if (item?.value) return item.value;
  } catch {
    // DB not ready
  }
  return fallback;
}

export async function getContents(
  keys: string[],
  locale: string,
  fallbacks: Record<string, string>
): Promise<Record<string, string>> {
  const result: Record<string, string> = {...fallbacks};
  try {
    const items = await prisma.pageContent.findMany({
      where: {locale, key: {in: keys}},
    });
    for (const item of items) {
      if (item.value) result[item.key] = item.value;
    }
  } catch {
    // DB not ready
  }
  return result;
}
