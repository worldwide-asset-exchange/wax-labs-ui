import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from notifications.bot.main import register_main_bot
from notifications.container import container
from notifications.core.repository import IDatabase
from notifications.services.listener import NotificationHandler
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")


@asynccontextmanager
async def setup_listeners(app: FastAPI) -> None:
    handler = container[NotificationHandler]

    logger.info("Starting listener")
    handler.listen()

    if cfg.telegram_bot_token:
        logger.info("Starting bot")
        async with register_main_bot(app):
            yield

    logger.info("Stopping listener")
    await handler.stop()

    logger.info("Closing DB connections")
    await container[IDatabase].safe_dispose()
