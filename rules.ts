import { Message } from "https://deno.land/x/grammy_types@v3.7.0/message.ts";

const keywords = [
  "путин",
  "криптовалют",
  "крипта",
  "крипте",
  "заработок",
  "заработа",
  "бизнес",
  "подписывай",
  "подписаться",
  "читать далее",
  "президент",
  "трейдинг",
];

const spoofingCharactersMap = {
  a: "а",
  c: "с",
  e: "е",
  h: "н",
  k: "к",
  m: "м",
  o: "о",
  p: "р",
  t: "т",
  x: "х",
  y: "у",
};

function normalizeText(text: string) {
  text = text.toLowerCase();

  for (const [char, replacement] of Object.entries(spoofingCharactersMap)) {
    text = text.replaceAll(char, replacement);
  }

  return text;
}

export function isSuspiciousText(text: string): boolean {
  const normalizedText = normalizeText(text);
  const lines = normalizedText.split("\n");

  return (
    keywords.some((keyword) => normalizedText.includes(keyword)) ||
    lines.length > 3
  );
}

function hasLink(message: Message) {
  return message.entities?.some(
    (entity) => entity.type === "url" || entity.type === "text_link"
  );
}

function hasAttachments(message: Message) {
  return (
    message.photo ||
    message.video ||
    message.document ||
    message.audio ||
    message.voice ||
    message.animation ||
    message.sticker ||
    message.video_note
  );
}

export function isSupposedSpam(message: Message) {
  const suspiciousText =
    isSuspiciousText(message.text ?? "") ||
    isSuspiciousText(message.caption ?? "");

  return suspiciousText && (hasLink(message) || hasAttachments(message));
}
