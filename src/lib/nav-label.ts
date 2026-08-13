const NAV_SLUG_PREFIX = "agefield-high-rock-the-school-";

const ACRONYM_LABELS: Record<string, string> = {};

function formatWord(word: string): string {
  const lower = word.toLowerCase();
  if (ACRONYM_LABELS[lower]) return ACRONYM_LABELS[lower];
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map(formatWord)
    .join(" ");
}

export function slugToNavLabel(slug: string): string {
  const leaf = slug.split("/").pop() || slug;
  const remainder = leaf.startsWith(NAV_SLUG_PREFIX) ? leaf.slice(NAV_SLUG_PREFIX.length) : leaf;
  if (!remainder) return "";
  return titleCase(remainder);
}

export function shortenTitleForNav(title: string): string {
  const colonMatch = title.match(/^[^:]+:\s*(.+)$/);
  if (colonMatch && /agefield high/i.test(title)) {
    return colonMatch[1].trim();
  }

  return title
    .replace(/^(mastering|master|unlock|dominate)\s+(the\s+)?/i, "")
    .replace(/^agefield high(?:\s*:\s*|\s+)rock the school[:\s-]*/i, "")
    .trim();
}

export function getNavLabel({
  title,
  navTitle,
  slug,
}: {
  title: string;
  navTitle?: string;
  slug: string;
}): string {
  if (navTitle?.trim()) return navTitle.trim();

  const fromSlug = slugToNavLabel(slug);
  if (fromSlug) return fromSlug;

  const shortened = shortenTitleForNav(title);
  return shortened || title;
}
