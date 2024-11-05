import { Bot } from "https://deno.land/x/grammy@v1.23.0/mod.ts";
import { isSupposedSpam } from "./rules.ts";

const FW_CHAT_ID = -1001478000911;

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

bot.on("my_chat_member", (ctx) => {
  const hasLeftChat = ["kicked", "left"].includes(
    ctx.myChatMember.new_chat_member.status,
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
  console.log(
    `Received message ${ctx.message.message_id}\n`,
    ctx.message.text?.slice(0, 25),
  );

  if (isSupposedSpam(ctx.message)) {
    console.log(
      `Message ${ctx.message.message_id} is supposed to be spam, deleting`,
    );
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
