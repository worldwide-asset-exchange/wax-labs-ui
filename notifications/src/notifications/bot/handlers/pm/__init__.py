from aiogram import Router

from notifications.bot.handlers.pm import help, start, status, stop, subscribe


def create_pm_router() -> Router:
    router = Router()
    router.include_routers(
        start.router,
        help.router,
        stop.router,
        status.router,
        subscribe.router,
    )

    return router
