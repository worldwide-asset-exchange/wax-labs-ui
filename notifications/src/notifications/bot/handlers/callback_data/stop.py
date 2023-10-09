from aiogram.filters.callback_data import CallbackData
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder


class StopCallback(CallbackData, prefix="stop"):
    @classmethod
    def restart_markup(cls) -> InlineKeyboardMarkup:
        markup = InlineKeyboardBuilder()
        markup.add(InlineKeyboardButton(text="Let's start", callback_data=cls().pack()))

        return markup.as_markup()
