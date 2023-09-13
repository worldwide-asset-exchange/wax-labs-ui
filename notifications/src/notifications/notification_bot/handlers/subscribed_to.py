from urllib.parse import urljoin

from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup, Message

from notifications.notification_bot.bot import bot
from notifications.settings import cfg


async def subscribed_to_handler(message: Message):
    keyboard = InlineKeyboardMarkup()

    async with bot.retrieve_data(user_id=message.from_user.id) as data:
        if not data:
            build_message = "You haven't subscribed to any proposal yet"
        else:
            for proposal_id, _ in data.items():
                keyboard.add(
                    InlineKeyboardButton(
                        f"Proposal {proposal_id}",
                        url=urljoin(cfg.wax_labs_proposal_base_url, proposal_id),
                    )
                )

            proposals_text = "proposal" if len(data) == 1 else "proposals"

            build_message = f"You have subscribed to {len(data)} {proposals_text}"

        await bot.send_message(chat_id=message.chat.id, text=build_message, reply_markup=keyboard)
