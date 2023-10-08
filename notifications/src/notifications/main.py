from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from notifications.bot.main import bot_startup
from notifications.core.config.exception_handlers import setup_exception_handlers
from notifications.core.config.logger import configure_logger
from notifications.core.config.middleware import setup_middlewares
from notifications.handlers import install_routes
from notifications.settings import cfg

app = FastAPI(
    title=cfg.app_name,
    description=cfg.app_description,
    redoc_url=None,
    debug=cfg.debug,
    version=cfg.app_version,
    default_response_class=ORJSONResponse,
)

setup_middlewares(app)
setup_exception_handlers(app)
install_routes(app)

_logger = configure_logger(cfg.log_level)

bot_startup(app)

_logger.info("Server started")
