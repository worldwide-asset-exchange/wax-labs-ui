from telebot.types import Message

from notifications.notification_bot.bot import bot
from notifications.notification_bot.chain import get_proposal_status
from notifications.settings import cfg

COMMAND = "/status "


async def status_handler(message: Message):
    proposal_id = message.text.strip(COMMAND) or cfg.all_proposals

    await bot.reply_to(message, "Looking for proposals status, this may take a while...")

    proposal_status = await get_proposal_status(proposal_id)

    await bot.send_message(
        chat_id=message.chat.id,
        text=f'The current status of the proposal {proposal_id} is <b>"{proposal_status}"</b>',
        parse_mode="html",
    )
