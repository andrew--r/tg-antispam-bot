import { Bot } from "grammy";
import { getPossibleSpamReasons } from "./rules.ts";
import { BOT_TOKEN, FW_CHAT_ID, AUTO_DELETE_TIMEOUT_MS } from "./constants.ts";
import { cancelTask, scheduleTask } from "./tasks.ts";

export const bot = new Bot(BOT_TOKEN);

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

bot.on("message", async (ctx) => {
  console.log(
    `Received message ${ctx.message.message_id}\n`,
    ctx.message.text?.slice(0, 25)
  );

  const spamReasons = getPossibleSpamReasons(ctx.message);

  if (spamReasons.length > 0) {
    console.log(`Message ${ctx.message.message_id} is supposed to be spam`);
    try {
      const reply = await ctx.reply(
        `⚠️ Возможный спам! Причины:\n— ${spamReasons.join(
          "\n— "
        )}\n\nЧтобы сообщение не было удалено через ${
          AUTO_DELETE_TIMEOUT_MS / 1000
        } секунд, поставьте на ответ бота реакцию 🌚`,
        { reply_parameters: { message_id: ctx.message.message_id } }
      );
      scheduleTask(AUTO_DELETE_TIMEOUT_MS, reply.message_id.toString(), () => {
        ctx.deleteMessages([ctx.message.message_id, reply.message_id]);
      });
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  }
});

bot.reaction("🌚", (ctx) => {
  const reaction = ctx.messageReaction;

  ctx.reply("Принято 🌚 cc @andrew_r", {
    reply_parameters: { message_id: reaction.message_id },
  });

  cancelTask(reaction.message_id.toString());
});

bot.catch((error) => {
  console.error("Error:", error);
});
