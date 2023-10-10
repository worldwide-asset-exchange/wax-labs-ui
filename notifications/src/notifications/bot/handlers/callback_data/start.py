from aiogram.filters.callback_data import CallbackData
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder


class StartCallback(CallbackData, prefix="start"):
    @classmethod
    def start_markup(cls, text: str | None = None) -> InlineKeyboardMarkup:
        markup = InlineKeyboardBuilder()
        markup.add(InlineKeyboardButton(text=text if text else "Let's start", callback_data=cls().pack()))

        return markup.as_markup()

    @classmethod
    def restart_markup(cls) -> InlineKeyboardMarkup:
        return cls.start_markup(text="Let's try it again")
