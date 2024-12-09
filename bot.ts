import { Bot } from "grammy";
import { getPossibleSpamReasons } from "./rules.ts";
import {
  BOT_TOKEN,
  FW_CHAT_ID,
  AUTO_DELETE_TIMEOUT_MS,
  USER_IDS_WHITELIST,
} from "./constants.ts";
import { cancelTask, getPendingTask, scheduleTask } from "./tasks.ts";

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

bot.on("message", async (ctx, next) => {
  console.log(
    `Received message ${ctx.message.message_id}\n`,
    ctx.message.text?.slice(0, 25)
  );

  if (USER_IDS_WHITELIST.has(ctx.message.from.id)) {
    return next();
  }

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

  await next();
});

bot.reaction("🌚", (ctx) => {
  const reaction = ctx.messageReaction;

  const pendingTaskId = reaction.message_id.toString();

  if (getPendingTask(pendingTaskId)) {
    ctx.reply("Принято 🌚 cc @andrew_r", {
      reply_parameters: { message_id: reaction.message_id },
    });
    cancelTask(pendingTaskId);
  }
});

bot.command("approve", async (ctx) => {
  if (!USER_IDS_WHITELIST.has(ctx.msg.from?.id!)) {
    return;
  }
  const approvedId = ctx.msg?.reply_to_message?.from?.id;

  if (approvedId !== undefined) {
    USER_IDS_WHITELIST.add(approvedId);
    await ctx.react("👍");
    setTimeout(() => {
      ctx.deleteMessage();
    }, 1000);
  }
});

bot.command("getApproved", async (ctx) => {
  if (!USER_IDS_WHITELIST.has(ctx.msg.from?.id!)) {
    return;
  }

  await ctx.reply(
    `Белый список пользователей:\n\`\`\`\n${JSON.stringify(
      Array.from(USER_IDS_WHITELIST),
      null,
      2
    )}\n\`\`\``,
    { parse_mode: "Markdown" }
  );
});

bot.catch((error) => {
  console.error("Error:", error);
});
