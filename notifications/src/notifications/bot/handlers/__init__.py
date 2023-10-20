from aiogram import Router

from notifications.bot.handlers.inline import create_inline_router
from notifications.bot.handlers.pm import create_pm_router


def create_bot_router() -> Router:
    router = Router()
    router.include_routers(
        create_pm_router(),
        create_inline_router(),
    )

    return router
