from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from loguru import logger

from notifications.core.config.exception_handlers import setup_exception_handlers
from notifications.core.config.logger import configure_logger
from notifications.core.config.middleware import setup_middlewares
from notifications.handlers import install_routes
from notifications.settings import cfg

app = FastAPI(
    title=cfg.app_name,
    description=cfg.app_description,
    docs_url=None,
    redoc_url=None,
    debug=cfg.debug,
    version=cfg.app_version,
    default_response_class=ORJSONResponse,
)

setup_middlewares(app)
setup_exception_handlers(app)
install_routes(app)

configure_logger()


logger.info("Server started")
