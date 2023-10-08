import enum
import logging
import sys


class LogLevelEnum(enum.IntEnum):
    CRITICAL = logging.CRITICAL
    FATAL = logging.FATAL
    ERROR = logging.ERROR
    WARNING = logging.WARNING
    WARN = logging.WARN
    INFO = logging.INFO
    DEBUG = logging.DEBUG
    NOTSET = logging.NOTSET


def configure_logger(log_level: LogLevelEnum):
    logger = logging.getLogger("waxlabs")
    logger.setLevel(log_level)
    logger.addHandler(logging.StreamHandler(sys.stdout))
