import { Message } from "https://deno.land/x/grammy_types@v3.7.0/message.ts";

const keywords = [
  "путин",
  "криптовалют",
  "крипта",
  "крипте",
  "заработ",
  "зарабат",
  "бизнес",
  "подписывай",
  "подписаться",
  "читать далее",
  "президент",
  "трейдинг",
  "в лс",
  "бесплатно",
  "оплата",
  "узнать больше",
  "доход",
  "прибыль",
  "прыбиль",
  "удален",
  "сотрудни",
  "легальн",
  "личны",
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
  u: "и",
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

export function getTextSuspicionScore(text: string): number {
  const normalizedText = normalizeText(text);
  const lines = normalizedText.split("\n");

  const matchedKeywords = keywords.filter((keyword) =>
    normalizedText.includes(keyword)
  );

  return matchedKeywords.length;
}

function hasLink(message: Message) {
  return (
    message.entities?.some(
      (entity) => entity.type === "url" || entity.type === "text_link"
    ) || message.text?.includes("t.me/")
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

function getFullMessageText(message: Message) {
  return `${message.text ?? ""}\n${message.caption ?? ""}`.trim();
}

export function isSupposedSpam(message: Message) {
  const textScore = getTextSuspicionScore(getFullMessageText(message));

  return textScore > 0;
}
