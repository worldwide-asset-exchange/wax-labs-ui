import logging
import sys
from logging import StreamHandler

from loguru import logger


def configure_logger():
    logger.add(StreamHandler(sys.stdout), serialize=True, level=logging.INFO)
