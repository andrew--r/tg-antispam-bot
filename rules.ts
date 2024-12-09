import { Message } from "grammy_types";
import {
  detectWordsWithMixedScripts,
  detectSpamKeywords,
} from "./lib/text/index.ts";

function detectLink(message: Message) {
  return (
    message.entities?.some(
      (entity) => entity.type === "url" || entity.type === "text_link"
    ) || message.text?.includes("t.me/")
  );
}

function detectAttachment(message: Message) {
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

export function getPossibleSpamReasons(message: Message): string[] {
  const hasAttachments = detectAttachment(message);
  const hasLink = detectLink(message);

  const fullMessageText = getFullMessageText(message);
  const hasCharacterSpoofing =
    detectWordsWithMixedScripts(fullMessageText).length > 0;
  const hasSpamKeywords = detectSpamKeywords(fullMessageText);

  return [
    hasAttachments && "Сообщение содержит медиа",
    hasLink && "Сообщение содержит ссылку",
    hasCharacterSpoofing && "Обнаружена подмена символов",
    hasSpamKeywords && "Обнаружены слова из списка спама",
  ].filter((value) => typeof value === "string");
}
