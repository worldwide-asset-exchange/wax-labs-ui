from aiogram import Router

from notifications.bot.handlers.pm import help, start, status, stop


def create_pm_router() -> Router:
    router = Router()
    router.include_routers(
        start.router,
        help.router,
        stop.router,
        status.router,
    )

    return router
