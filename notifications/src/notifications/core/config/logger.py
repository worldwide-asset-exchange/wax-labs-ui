import logging
import sys
import typing

if typing.TYPE_CHECKING:
    from notifications.settings import LogLevelEnum


def configure_logger(log_level: "LogLevelEnum") -> logging.Logger:
    logger = logging.getLogger("waxlabs")
    logger.setLevel(log_level)

    formatter = logging.Formatter('%(asctime)s [%(process)d] [%(levelname)s] %(message)s')

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    logger.addHandler(handler)

    return logger
