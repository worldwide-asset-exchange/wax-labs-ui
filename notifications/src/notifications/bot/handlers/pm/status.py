import logging
from urllib.parse import urljoin

from aiogram import Bot, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from aiogram.utils import markdown as md
from pydantic import ValidationError

from notifications.bot.utils import get_args, proposal_status_to_message
from notifications.container import container
from notifications.interfaces.proposal_service import IProposalService
from notifications.settings import cfg
from notifications.wax_interface.queries import WaxObjectNotFound
from notifications.wax_interface.queries.proposals import get_proposal

router = Router()

_logger = logging.getLogger("waxlabs")


@router.message(Command(commands=["status"]))
async def status_handler(message: Message, state: FSMContext, bot: Bot):
    proposal_service = container[IProposalService]

    bot_message: Message | None = None

    try:
        proposal_id: str = get_args(message)

        int_proposal_id = int(proposal_id)

        bot_message = await message.answer(
            text=(
                "Checking status of "
                f" {md.link(f'proposal {proposal_id}', urljoin(cfg.wax_labs_proposal_base_url, proposal_id))}..."
            ),
            parse_mode=ParseMode.MARKDOWN,
        )

        wax_proposal = await get_proposal(int_proposal_id)

        await proposal_service.update_status(wax_proposal)

        await bot.edit_message_text(
            proposal_status_to_message(wax_proposal.proposal_id, wax_proposal.status),
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except WaxObjectNotFound:
        await bot.edit_message_text(
            text="I couldn't find a proposal with that ID. Please, make sure you typed it correctly.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except ValidationError as ex:
        _logger.error("Validation error", exc_info=ex)

        await bot.edit_message_text(
            text="Darn it, something went wrong while trying to get the proposal status. Please, try again.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except ValueError:
        await bot.edit_message_text(
            text="Please, provide a valid proposal ID.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except Exception as e:
        _logger.exception("Getting proposal status failed", exc_info=e)

        await bot.edit_message_text(
            text="😖 Something went wrong. Please, try again later.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
        )
