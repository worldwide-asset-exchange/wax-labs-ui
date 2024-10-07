import asyncio
import logging
from contextlib import asynccontextmanager
from urllib.parse import urlparse

from aiogram import Bot, Dispatcher
from aiogram_fastapi_server import SimpleRequestHandler, setup_application
from fastapi import FastAPI

from notifications.bot.bot import update_commands
from notifications.bot.handlers import create_bot_router
from notifications.container import container
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")


@asynccontextmanager
async def register_main_bot(app: FastAPI):
    dp = container[Dispatcher]
    bot = container[Bot]

    dp.include_router(create_bot_router())

    try:
        if cfg.debug:
            logger.info("Registering bot as long-polling bot")

            async with _local_register_main_bot(dp=dp, bot=bot):
                logger.info("Bot Started")

                yield
        else:
            logger.info("Registering bot as webhook")

            async with _server_register_main_bot(dp=dp, app=app, bot=bot):
                logger.info("Bot Started")

                yield
    finally:
        pass


@asynccontextmanager
async def _server_register_main_bot(dp: Dispatcher, app: FastAPI, bot: Bot):
    if not cfg.telegram_bot_token:
        yield

    try:
        if cfg.telegram_bot_webhook is not None:
            path = urlparse(cfg.telegram_bot_webhook).path
        else:
            path = cfg.telegram_bot_path

        SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path=path)
        setup_application(app, dp, bot=bot)

        logger.info("Setting webhook for bot")

        await update_commands(bot=bot)

        await bot.set_webhook(cfg.telegram_bot_webhook)

        yield
    finally:
        pass


@asynccontextmanager
async def _local_register_main_bot(dp: Dispatcher, bot: Bot, **kwargs):
    task: asyncio.Task | None = None

    try:
        task = asyncio.create_task(dp.start_polling(bot, **kwargs))

        yield
    finally:
        if task:
            print(f"task: {task} is cancelled: {task.cancelled()}")

            task.cancel()

        await dp.stop_polling()
