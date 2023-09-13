from telebot.types import Message

from notifications.notification_bot.bot import bot
from notifications.settings import cfg

COMMAND = "/subscribe"


async def subscribe_handler(message: Message):
    subscribe_to = message.text.strip(COMMAND).strip()

    if not subscribe_to:
        await bot.reply_to(message, "This command requires a proposal id to be passed")

        return

    subscribe_to_all = subscribe_to == cfg.all_proposals

    async with bot.retrieve_data(user_id=message.from_user.id) as data:
        if not data:
            data = {}

        data[subscribe_to] = "status"

    if subscribe_to_all:
        await bot.reply_to(message, "You subscribed to all Proposals update")
    else:
        await bot.reply_to(message, f"You subscribed to all updates on Proposal {subscribe_to}")
