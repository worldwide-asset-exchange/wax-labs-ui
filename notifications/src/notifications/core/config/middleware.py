import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from notifications.container import container
from notifications.core.repository import IDatabase
from notifications.services.listener import NotificationHandler
from notifications.settings import cfg

logger = logging.getLogger("waxlabs")


def setup_middlewares(app: FastAPI) -> None:
    backend_cors_origins = cfg.backend_cors_origins if cfg.backend_cors_origins else ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in backend_cors_origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if not cfg.debug:
        app.add_middleware(
            ProxyHeadersMiddleware,
            trusted_hosts=[str(origin) for origin in cfg.backend_trusted_origins],
        )

    if cfg.enable_gzip:
        app.add_middleware(GZipMiddleware, minimum_size=150)

    @app.on_event("shutdown")
    async def shutdown_event():
        await container[IDatabase].safe_dispose()


def setup_listener(app: FastAPI) -> None:
    handler = container[NotificationHandler]

    @app.on_event("shutdown")
    async def shutdown_event():
        await handler.stop()

    @app.on_event("startup")
    async def pull_telegram():
        handler.listen()
