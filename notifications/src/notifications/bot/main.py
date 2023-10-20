import asyncio
import logging

from aiogram import Bot, Dispatcher
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
        logger.info("Registering bot as long-polling bot")

        _local_register_main_bot(dp=dp, app=app, bot=bot)
    else:
        logger.info("Registering bot as webhook")

        _server_register_main_bot(dp=dp, app=app, bot=bot)

        @dp.startup.register
        async def sync_telegram():
            if not cfg.telegram_bot_token:
                return None

            await update_commands(bot=bot)

            if not cfg.debug:
                logger.info("Setting webhook for bot")

                await bot.set_webhook(cfg.telegram_bot_webhook)


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
