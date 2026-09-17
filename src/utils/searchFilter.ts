/**
 * Multi-field case-insensitive smart tokenized search matching utility.
 * Evaluates whether a search query matches across an item's metadata
 * (title, year, tags, units, category) or via a Deep Raw Fallback Match on
 * the stringified raw JSON object, with explicit number-to-string coercion.
 */

export interface MultiFieldSearchTarget {
  title?: string | null;
  name?: string | null;
  year?: number | string | null;
  tags?: (string | null | undefined)[] | string | null;
  badges?: (string | null | undefined)[] | string | null;
  tag?: string | null;
  badge?: string | null;
  units?: unknown;
  variables?: unknown;
  unit?: string | null;
  siUnits?: string | null;
  subject?: string | null;
  category?: string | null;
  description?: string | null;
  definition?: string | null;
  filename?: string | null;
  fileUrl?: string | null;
  pdfUrl?: string | null;
  url?: string | null;
  masterArchiveUrl?: string | null;
  session?: string | null;
  sessionLabel?: string | null;
  code?: string | null;
  formula?: string | null;
  topic?: string | null;
  question?: string | null;
  answer?: string | null;
  [key: string]: any;
}

export const COMMON_FILLER_WORDS = new Set([
  'to',
  'in',
  'and',
  'or',
  'of',
  'for',
  'with',
  'a',
  'an',
  'the',
  'into',
  'from',
  'vs',
  'by',
]);

/**
 * Splits a search query into lowercase tokens and filters out common filler words.
 */
export function tokenizeQuery(query: string): string[] {
  if (!query || !query.trim()) return [];
  const rawTokens = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const meaningful = rawTokens.filter((token) => !COMMON_FILLER_WORDS.has(token));
  return meaningful.length > 0 ? meaningful : rawTokens;
}

/**
 * Recursively checks if a search string exists within an arbitrary value,
 * array, or nested object property, with explicit number-to-string coercion.
 */
function valueIncludesQuery(val: unknown, queryStr: string): boolean {
  if (val === null || val === undefined) return false;

  if (typeof val === 'number') {
    return val.toString().toLowerCase().includes(queryStr);
  }

  if (typeof val === 'string') {
    return val.toLowerCase().includes(queryStr);
  }

  if (Array.isArray(val)) {
    return val.some((entry) => valueIncludesQuery(entry, queryStr));
  }

  if (typeof val === 'object') {
    return Object.values(val).some((prop) => valueIncludesQuery(prop, queryStr));
  }

  return false;
}

/**
 * Checks individual standard metadata properties of an item against a query token/string:
 * - title or name
 * - year (with safe .toString() type coercion)
 * - tags or badges
 * - units or variables
 * - category or subject
 * - contextual properties (filename, fileUrl, session, description, etc.)
 */
function checkIndividualProperties(item: MultiFieldSearchTarget, queryStr: string): boolean {
  // 1. item.title or item.name
  if (valueIncludesQuery(item.title, queryStr) || valueIncludesQuery(item.name, queryStr)) {
    return true;
  }

  // 2. item.year (ensuring number-to-string type coercion via .toString() for numbers like 2024)
  if (item.year !== null && item.year !== undefined && !Number.isNaN(item.year)) {
    const yearStr = item.year.toString().toLowerCase();
    if (yearStr.includes(queryStr)) {
      return true;
    }
  }

  // 3. item.tags or item.badges
  if (
    valueIncludesQuery(item.tags, queryStr) ||
    valueIncludesQuery(item.badges, queryStr) ||
    valueIncludesQuery(item.tag, queryStr) ||
    valueIncludesQuery(item.badge, queryStr)
  ) {
    return true;
  }

  // 4. item.units or item.variables (e.g., typing "kg", "g", or "m/s")
  if (
    valueIncludesQuery(item.units, queryStr) ||
    valueIncludesQuery(item.variables, queryStr) ||
    valueIncludesQuery(item.unit, queryStr) ||
    valueIncludesQuery(item.siUnits, queryStr)
  ) {
    return true;
  }

  // 5. item.category or item.subject
  if (
    valueIncludesQuery(item.category, queryStr) ||
    valueIncludesQuery(item.subject, queryStr)
  ) {
    return true;
  }

  // 6. Secondary contextual properties (file paths, filenames, sessions, formulas, etc.)
  if (
    valueIncludesQuery(item.filename, queryStr) ||
    valueIncludesQuery(item.fileUrl, queryStr) ||
    valueIncludesQuery(item.pdfUrl, queryStr) ||
    valueIncludesQuery(item.url, queryStr) ||
    valueIncludesQuery(item.masterArchiveUrl, queryStr) ||
    valueIncludesQuery(item.session, queryStr) ||
    valueIncludesQuery(item.sessionLabel, queryStr) ||
    valueIncludesQuery(item.description, queryStr) ||
    valueIncludesQuery(item.definition, queryStr) ||
    valueIncludesQuery(item.code, queryStr) ||
    valueIncludesQuery(item.formula, queryStr) ||
    valueIncludesQuery(item.topic, queryStr) ||
    valueIncludesQuery(item.question, queryStr) ||
    valueIncludesQuery(item.answer, queryStr)
  ) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether an item matches a search query.
 *
 * Requirements:
 * 1. Deep Raw Fallback Match:
 *    - Converts both search query (searchQuery.toLowerCase().trim()) and item
 *      (JSON.stringify(item).toLowerCase()) into searchable text.
 *    - In addition to checking individual properties (title, year, tags, units, category),
 *      also checks if the query string matches any part of the raw JSON stringified item.
 *    - Guarantees that if "2024" or a unit like "kg" appears anywhere in the file path,
 *      filename, or object properties, it will never be filtered out.
 * 2. Number-to-string type coercion:
 *    - Ensures item.year (even if stored as a number like 2024) is safely converted via
 *      .toString() before checking inclusion.
 * 3. Smart Tokenized / Relational Match:
 *    - For multi-word queries like "kg to g" or "som 2024", breaks the query into tokens,
 *      filters common filler words, and ensures all tokens match metadata or raw JSON.
 */
export function matchesMultiField(
  item: MultiFieldSearchTarget | null | undefined,
  searchQuery: string
): boolean {
  if (!searchQuery || !searchQuery.trim()) return true;
  if (!item || typeof item !== 'object') return false;

  // 1. Convert search query into clean, trimmed lowercase searchable text
  const normalizedQuery = searchQuery.toLowerCase().trim();
  if (!normalizedQuery) return true;

  // 2. Convert item into searchable raw JSON text (Deep Raw Fallback searchable text)
  let rawJsonText = '';
  try {
    rawJsonText = JSON.stringify(item).toLowerCase();
  } catch {
    rawJsonText = '';
  }

  // 3. Deep Raw Fallback Match (Full Query Match):
  // Checks if the full query string matches any part of the raw JSON stringified item.
  // This guarantees that if "2024" appears anywhere in the file path, filename, or object properties,
  // it will never be filtered out.
  if (rawJsonText && rawJsonText.includes(normalizedQuery)) {
    return true;
  }

  // 4. Individual Properties Match (Full Query Match):
  // Checks individual properties: title, year (.toString()), tags, units, category
  if (checkIndividualProperties(item, normalizedQuery)) {
    return true;
  }

  // 5. Smart Tokenized Match (for relational or multi-word queries like "kg to g" or "som 2024"):
  const tokens = tokenizeQuery(searchQuery);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    // Check individual properties for the token
    if (checkIndividualProperties(item, token)) {
      return true;
    }
    // Deep Raw Fallback Match for the token on stringified raw JSON
    if (rawJsonText && rawJsonText.includes(token)) {
      return true;
    }
    return false;
  });
}

// Global aliases and exports
export const searchFilter = matchesMultiField;
export default matchesMultiField;
