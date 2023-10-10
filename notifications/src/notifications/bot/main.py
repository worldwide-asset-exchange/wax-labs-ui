import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram_fastapi_server import SimpleRequestHandler, setup_application
from fastapi import FastAPI

from notifications.bot.bot import update_commands
from notifications.bot.handlers import create_bot_router
from notifications.container import container
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")


def bot_startup(app: FastAPI):
    if not cfg.telegram_bot_token:
        return None

    bot = container[Bot]

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

    @app.on_event("startup")
    async def update_bot_commands():
        await update_commands(bot=bot)


def _server_register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot):
    SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path=cfg.telegram_bot_path)
    setup_application(app, dp, bot=bot)


def _local_register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot, **kwargs):
    task: asyncio.Task | None = None

    @app.on_event("startup")
    async def start_local_bot():
        nonlocal task

        task = asyncio.create_task(dp.start_polling(bot, **kwargs))

    @app.on_event("shutdown")
    async def stop_local_bot():
        nonlocal task

        if task:
            print(f"task: {task} is cancelled: {task.cancelled()}")

            task.cancel()
        await dp.stop_polling()


async def bot_set_webhook():
    if not cfg.telegram_bot_token:
        return None

    bot = Bot(
        cfg.telegram_bot_token,
        parse_mode=ParseMode.HTML,
    )

    if cfg.debug:
        await bot.delete_webhook()
    else:
        await bot.set_webhook(cfg.telegram_bot_webhook)
