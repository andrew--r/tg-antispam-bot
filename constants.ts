export const FW_CHAT_ID = -1001478000911;
export const FW_CHANNEL_ID = -1001049110127;

export const ADMIN_ID = 58948765;

export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
export const AUTO_DELETE_TIMEOUT_MS = 1000 * 20;

export const USER_IDS_WHITELIST = new Set([
  FW_CHANNEL_ID,
  FW_CHAT_ID,
  ADMIN_ID,
  144310173,
  777000,
  121729445,
  74203572,
  72435512,
  891066,
  1808128,
]);
