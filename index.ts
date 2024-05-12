import { webhookCallback } from "https://deno.land/x/grammy@v1.23.0/mod.ts";
import { bot } from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (request) => {
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
