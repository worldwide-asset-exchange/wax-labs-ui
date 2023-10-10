from aiogram.filters.callback_data import CallbackData
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder


class HelpCallback(CallbackData, prefix="help"):
    @classmethod
    def help_markup(cls) -> InlineKeyboardMarkup:
        markup = InlineKeyboardBuilder()
        markup.add(InlineKeyboardButton(text="Show available commands", callback_data=cls().pack()))
        return markup.as_markup()
