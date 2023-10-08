from aiogram import Router

from notifications.bot.handlers.pm import start


def create_pm_router() -> Router:
    router = Router()
    router.include_router(start.router)

    return router
