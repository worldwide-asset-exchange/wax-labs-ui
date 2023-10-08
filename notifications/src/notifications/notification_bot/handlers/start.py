from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup, Message

from notifications.container import container
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService
from notifications.notification_bot.bot import bot

START_MESSAGE = """
Hello {}, 

How can I help you today?
"""


async def start_handler(message: Message):
    user_service = container[IUserService]
    container[ISubscriptionService]

    await user_service.get_by_telegram_account(message.from_user.username)
    # subscriptions = await subscription_service.all(
    #     filters=subscription_service.table
    # )

    # if not user or user

    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("Show available commands", callback_data="get-help"))

    async with bot.retrieve_data(user_id=message.from_user.id) as data:
        if not data:
            data["state_initialized"] = True

    await bot.send_message(
        chat_id=message.chat.id,
        text=START_MESSAGE.format(message.from_user.full_name),
        reply_markup=keyboard,
    )
