import logging

from aiogram import Bot
from aiogram.types import BotCommand

logger = logging.getLogger("waxlabs")

COMMANDS = [
    BotCommand(command="start", description="Start the bot."),
    BotCommand(command="cancel", description="Cancel the current operation."),
    BotCommand(command="stop", description="Stop the bot."),
    BotCommand(command="status", description="Get the status of all proposals. You can also send the proposal id."),
    BotCommand(command="help", description="Display the help message"),
    BotCommand(
        command="subscribe",
        description="Subscribe to a proposal. You can also send the proposal id.",
    ),
    BotCommand(
        command="unsubscribe",
        description="Unsubscribe from all proposals. You can also send the proposal id.",
    ),
    BotCommand(
        command="subscribed_to",
        description="Get the list of proposals you are subscribed to.",
    ),
]

COMMAND_UNIQUE = {c.command for c in COMMANDS}


async def update_commands(bot: Bot):
    commands = await bot.get_my_commands()
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
