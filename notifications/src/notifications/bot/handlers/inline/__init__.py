from aiogram import Router

from notifications.bot.handlers.inline import ping


def create_inline_router() -> Router:
    router = Router()
    router.include_router(ping.router)

    return router
