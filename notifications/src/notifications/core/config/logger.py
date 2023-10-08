import logging
import sys
import typing

if typing.TYPE_CHECKING:
    from notifications.settings import LogLevelEnum


def configure_logger(log_level: "LogLevelEnum") -> logging.Logger:
    logger = logging.getLogger("waxlabs")
    logger.setLevel(log_level)
    logger.addHandler(logging.StreamHandler(sys.stdout))

    return logger
