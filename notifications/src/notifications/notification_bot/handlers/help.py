from notifications.notification_bot.bot import bot
from notifications.settings import cfg

HELP_MESSAGE = """
I can help you track all your Proposals or just a few of them

The available commands are:

/help - display available commands and information

/status - status of all your proposals
/status {{proposalId}} - status of a specific proposal
/status - status of all your proposals
/status {{proposalId}} - status of a specific proposal

The bot also supports inline. Type @{} in any chat and the proposalId to get the current status.
"""


async def help_handler(message):
    await bot.send_message(
        message.chat.id,
        HELP_MESSAGE.format(cfg.telegram_bot_username),
    )
