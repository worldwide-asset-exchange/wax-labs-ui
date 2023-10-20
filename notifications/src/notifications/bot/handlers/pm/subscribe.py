import logging

from aiogram import Bot, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message
from aiogram.utils import markdown
from sqlalchemy.exc import NoResultFound

from notifications.bot.utils import get_args
from notifications.container import container
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService

router = Router()

_logger = logging.getLogger("waxlabs")


class ProposalNotFound(Exception):
    pass


@router.message(Command(commands=["subscribe"]))
async def subscribe_handler(message: Message | CallbackQuery, state: FSMContext, bot: Bot):
    user_service = container[IUserService]
    subscription_service = container[ISubscriptionService]
    proposal_service = container[IProposalService]

    from_user = message.from_user
    bot_message = None
    proposal_id: str = get_args(message)

    try:
        int_proposal_id = int(proposal_id)

        bot_message = await message.answer(f"⏳ I'm subscribing you to the proposal {proposal_id}...")

        if not (await proposal_service.proposal_exists(int_proposal_id)):
            raise ProposalNotFound()

        user = await user_service.get_by_telegram_account(from_user.username)

        await subscription_service.subscribe_to_proposal(int_proposal_id, user.uuid)

        await bot.edit_message_text(
            text=f"✅ You are now subscribed to the proposal {markdown.bold(proposal_id)}.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )

    except ProposalNotFound:
        await bot.edit_message_text(
            text="I couldn't find a proposal with that ID. Please, make sure you typed it correctly.",
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
    except ValueError:
        await bot.edit_message_text(
            text="Please, provide a proposal ID.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except Exception as e:
        _logger.exception("Subscribing to proposal %s", proposal_id, exc_info=e)

        await bot.edit_message_text(
            text="😖 Something went wrong. Please, try again later.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
