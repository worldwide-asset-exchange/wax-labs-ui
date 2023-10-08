import logging
from pathlib import Path

from telebot.async_telebot import AsyncTeleBot
from telebot.asyncio_handler_backends import State, StatesGroup
from telebot.types import BotCommand

from notifications.notification_bot.exception_handler import ExceptionHandler
from notifications.notification_bot.storage import JsonStorage
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")

COMMANDS = [
    BotCommand(command="status", description="Status of all your proposals. You can also send the proposal id."),
    BotCommand(command="help", description="Display available commands and information."),
    BotCommand(
        command="subscribe",
        description="Subscribe to the status update of all your proposals. You can also send the proposal id.",
    ),
    BotCommand(
        command="subscribed_to",
        description="List all proposals you have subscribed to.",
    ),
]

COMMAND_UNIQUE = {c.command for c in COMMANDS}

state_file = Path("./.state-save/states.pkl")

bot = AsyncTeleBot(
    cfg.telegram_bot_token,
    state_storage=JsonStorage(),
    exception_handler=ExceptionHandler(),
)


class States(StatesGroup):
    proposal_ids = State()


async def update_commands():
    commands = await bot.get_my_commands(None, None)
    current_commands = {c.command for c in commands}
    current_command_mapping = {c.command: c.description for c in commands}

    rebuild_commands = False

    for c in COMMANDS:
        if c.command not in current_commands or current_command_mapping.get(c.command) != c.description:
            rebuild_commands = True
            break

    if not rebuild_commands and (
        current_commands.difference(COMMAND_UNIQUE) or COMMAND_UNIQUE.difference(current_commands)
    ):
        rebuild_commands = True

    if rebuild_commands:
        logger.info("Rebuilding commands")
        await bot.set_my_commands(COMMANDS)
