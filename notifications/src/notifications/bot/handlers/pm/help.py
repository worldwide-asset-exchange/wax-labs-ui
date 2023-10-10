from aiogram import Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.types import CallbackQuery, Message

from notifications.bot.handlers.callback_data.help import HelpCallback
from notifications.container import container
from notifications.core.utils.templates import TemplateEngine
from notifications.settings import cfg

router = Router()


@router.message(Command("help"))
@router.callback_query(HelpCallback.filter())
async def help_handler(message: Message | CallbackQuery):
    tpl_engine = container[TemplateEngine]

    message = message.message if isinstance(message, CallbackQuery) else message
    await message.answer(
        text=tpl_engine.render_telegram("bot/help_message", telegram_bot_username=cfg.telegram_bot_username),
        parse_mode=ParseMode.HTML,
    )
