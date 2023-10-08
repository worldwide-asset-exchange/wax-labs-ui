# import asyncio
# import logging
#
# from notifications.bot.bot import update_commands
# from notifications.bot.handlers.callbacks import callback_handler
# from notifications.bot.handlers.help import help_handler
# from notifications.bot.handlers.inline_query import inline_query_handler
# from notifications.bot.handlers.start import start_handler
# from notifications.bot.handlers.status import status_handler
# from notifications.bot.handlers.subscribe import subscribe_handler
# from notifications.bot.handlers.subscribed_to import subscribed_to_handler
#
# logger = logging.getLogger("waxlabs")
#
#
# async def serve_bot():
#     from notifications.bot.bot import bot
#
#     logger.info("Updating commands if necessary")
#
#     await update_commands()
#
#     logger.info("Adding message handlers")
#
#     bot.message_handler(commands=["help"])(help_handler)
#     bot.message_handler(commands=["status"])(status_handler)
#     bot.message_handler(commands=["subscribe"])(subscribe_handler)
#     bot.message_handler(commands=["subscribed_to"])(subscribed_to_handler)
#     bot.message_handler(commands=["start"])(start_handler)
#     bot.message_handler(func=lambda m: True)(start_handler)
#     bot.callback_query_handler(func=lambda call: True)(callback_handler)
#     bot.inline_handler(func=lambda query: query.query == "text")(inline_query_handler)
#
#     logger.info("Starting message pooling")
#     await bot.infinity_polling()
#
#
# if __name__ == "__main__":
#     asyncio.run(serve_bot())
