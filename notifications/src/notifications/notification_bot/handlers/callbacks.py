from telebot.types import CallbackQuery

from notifications.notification_bot.handlers.help import help_handler
from notifications.notification_bot.handlers.start import start_handler


async def callback_handler(query: CallbackQuery):
    match query.data:
        case "get-help" | "help":
            await help_handler(query.message)
        case _:
            await start_handler(query.message)
