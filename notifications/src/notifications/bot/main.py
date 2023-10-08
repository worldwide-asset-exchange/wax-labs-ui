import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram_fastapi_server import SimpleRequestHandler, setup_application
from fastapi import FastAPI

from notifications.bot.handlers import create_bot_router
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")


def bot_startup(app: FastAPI):
    if not cfg.telegram_bot_token:
        return None

    bot = Bot(cfg.telegram_bot_token, parse_mode="HTML")

    dp = Dispatcher()
    dp.include_router(create_bot_router())

    logger.info("Starting bot")

    register_main_bot(dp=dp, app=app, bot=bot)

    logger.info("Bot Started")


def register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot):
    if cfg.debug:
        _local_register_main_bot(dp=dp, app=app, bot=bot)
    else:
        _server_register_main_bot(dp=dp, app=app, bot=bot)


def _server_register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot):
    SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path=cfg.telegram_bot_path)
    setup_application(app, dp, bot=bot)


def _local_register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot, **kwargs):
    @app.on_event("startup")
    async def start_local_bot():
        asyncio.create_task(dp.start_polling(bot, **kwargs))

    @app.on_event("shutdown")
    async def stop_local_bot():
        await dp.stop_polling()


async def bot_set_webhook():
    if not cfg.telegram_bot_token:
        return None

    bot = Bot(cfg.telegram_bot_token, parse_mode="HTML")

    if cfg.debug:
        await bot.delete_webhook()
    else:
        await bot.set_webhook(cfg.telegram_bot_webhook)
