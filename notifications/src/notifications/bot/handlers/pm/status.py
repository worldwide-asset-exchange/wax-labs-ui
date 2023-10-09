import logging
from urllib.parse import urljoin

from aiogram import Bot, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from aiogram.utils import markdown as md
from pydantic import ValidationError

from notifications.bot.utils import proposal_status_to_message
from notifications.settings import cfg
from notifications.wax_interface.queries import WaxObjectNotFound
from notifications.wax_interface.queries.proposals import get_proposal
from notifications.wax_interface.schemas.types import ProposalStatus

router = Router()

_logger = logging.getLogger("waxlabs")

command = "status"


@router.message(Command(commands=[command]))
async def status_handler(message: Message, state: FSMContext, bot: Bot):
    bot_message: Message | None = None

    try:
        proposal_id: str = message.text.split(f"/{command} ")[1]

        int_proposal_id = int(proposal_id)

        bot_message = await message.answer(
            text=(
                "Checking status of "
                f" {md.link(f'proposal {proposal_id}', urljoin(cfg.wax_labs_proposal_base_url, proposal_id))}..."
            ),
            parse_mode=ParseMode.MARKDOWN,
        )

        proposal = await get_proposal(int_proposal_id)

        await bot.edit_message_text(
            proposal_status_to_message(proposal.proposal_id, proposal.status),
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            parse_mode=ParseMode.MARKDOWN,
        )
    except WaxObjectNotFound:
        await message.answer(
            text="I couldn't find a proposal with that ID. Please, make sure you typed it correctly.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
        )
    except ValidationError as ex:
        _logger.error("Validation error", exc_info=ex)

        await message.answer(
            text="Darn it, something went wrong while trying to get the proposal status. Please, try again.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
        )
    except ValueError:
        await message.answer(
            text="Please, provide a valid proposal ID.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
        )
