import logging

from aiogram import Bot, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message
from aiogram.utils import markdown
from sqlalchemy.exc import NoResultFound

from notifications.container import container
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService

router = Router()

_logger = logging.getLogger("waxlabs")


class SubscriptionNotFound(Exception):
    pass


@router.message(Command(commands=["subscribed_to"]))
async def unsubscribe_handler(message: Message | CallbackQuery, state: FSMContext, bot: Bot):
    user_service = container[IUserService]
    subscription_service = container[ISubscriptionService]

    from_user = message.from_user
    bot_message = None

    try:
        bot_message = await message.answer("⏳ I'm looking for your subscriptions...")

        user = await user_service.get_by_telegram_account(from_user.username)

        subscriptions = await subscription_service.all(subscription_service.table.user_id == user.uuid)

        if not subscriptions:
            message_text = "You are not subscribed to any proposal."
        else:
            message_text = "You are subscribed to the following proposals:\n\n"
            for subscription in subscriptions:
                message_text += f"- {markdown.bold(subscription.proposal_id)}\n"

        await bot.edit_message_text(
            text=message_text,
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )

    except NoResultFound:
        await bot.edit_message_text(
            text="I don't think I know you. Please, use /start to get started.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except Exception as e:
        _logger.exception("Listing subscriptions", exc_info=e)

        await bot.edit_message_text(
            text="😖 Something went wrong. Please, try again later.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
