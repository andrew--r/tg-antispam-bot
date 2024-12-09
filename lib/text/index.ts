import { SPAM_KEYWORDS, SPOOFING_CHARACTERS_MAP } from "./constants.ts";

const cyrillicRegex = /[\u0400-\u04FF]/;
const latinRegex = /[\u0041-\u007A]/;

/**
 * Checks if text has words with mixed cyrillic and latin characters,
 * which is usually a sign of characters spoofing
 */
export function detectWordsWithMixedScripts(text: string): string[] {
  return text
    .split(/\s+/)
    .filter((word) => cyrillicRegex.test(word) && latinRegex.test(word));
}

function normalizeText(text: string): string {
  text = text.toLowerCase();

  for (const [char, replacement] of Object.entries(SPOOFING_CHARACTERS_MAP)) {
    text = text.replaceAll(char, replacement);
  }

  return text;
}

export function detectSpamKeywords(text: string): boolean {
  const normalizedText = normalizeText(text);

  return SPAM_KEYWORDS.some((keyword) => normalizedText.includes(keyword));
}
