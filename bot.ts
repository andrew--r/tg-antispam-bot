import { Bot } from "https://deno.land/x/grammy@v1.23.0/mod.ts";
import { isSupposedSpam } from "./rules.ts";

const FW_CHAT_ID = -1001478000911;

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

bot.on("my_chat_member", (ctx) => {
  const hasLeftChat = ["kicked", "left"].includes(
    ctx.myChatMember.new_chat_member.status
  );

  if (!hasLeftChat && ctx.myChatMember.chat.id !== FW_CHAT_ID) {
    try {
      ctx.leaveChat();
    } catch (error) {
      console.error("Failed to leave chat", error);
    }
  }
});

bot.on("message", (ctx) => {
  if (isSupposedSpam(ctx.message)) {
    try {
      ctx.deleteMessage();
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  }
});

bot.catch((error) => {
  console.error("Error:", error);
});
