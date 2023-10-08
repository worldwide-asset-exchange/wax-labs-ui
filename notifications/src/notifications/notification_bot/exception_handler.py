import logging

import telebot

logger = logging.getLogger("waxlabs")


class ExceptionHandler(telebot.ExceptionHandler):
    def handle(self, exception):
        logger.exception("Exception was raised while processing message", exc_info=exception)
