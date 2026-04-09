import {prisma} from './prisma';

/**
 * Get a page content value from DB, falling back to the provided default.
 */
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
