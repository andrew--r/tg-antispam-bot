import { webhookCallback } from "grammy";
import { bot } from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (request) => {
  if (request.method === "GET") {
    return new Response("powder! go away");
  }

  if (request.method === "POST") {
    const url = new URL(request.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(request);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return new Response();
});
