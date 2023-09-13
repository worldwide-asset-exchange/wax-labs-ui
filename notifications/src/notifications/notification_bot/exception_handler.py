import telebot
from loguru import logger


class ExceptionHandler(telebot.ExceptionHandler):
    def handle(self, exception):
        logger.exception("Exception was raised while processing message")
