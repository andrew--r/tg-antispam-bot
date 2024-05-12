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
];

export function suspiciousText(text: string) {
  const normalizedText = text.toLowerCase();
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
  return (
    suspiciousText(message.text ?? "") &&
    (hasLink(message) || hasAttachments(message))
  );
}
