# tg-antispam-bot

Simple bot based on Deno and [grammY](https://grammy.dev/) that deletes supposed
spam messages from chat.

To set up an instance of the bot, deploy it somewhere and register webhook
through Telegram API by making a GET request to the following URL (replace placeholders with
your own params):

```
https://api.telegram.org/bot<token>/setWebhook?url=<botHost>/<token>&allowed_updates=["message","my_chat_member","message_reaction","callback_query"]
```
