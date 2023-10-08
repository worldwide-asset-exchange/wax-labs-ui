from aiogram import Router

from notifications.bot.handlers.pm import help, start


def create_pm_router() -> Router:
    router = Router()
    router.include_routers(
        start.router,
        help.router,
    )

    return router
