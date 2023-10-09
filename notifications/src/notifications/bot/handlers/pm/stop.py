import logging

from aiogram import Bot, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, KeyboardButton, Message, ReplyKeyboardMarkup, ReplyKeyboardRemove
from aiogram.utils import markdown as md
from sqlalchemy.exc import NoResultFound

from notifications.bot.handlers.callback_data.stop import StopCallback
from notifications.container import container
from notifications.interfaces.user_service import IUserService
from notifications.schemas.users import UserExport

router = Router()

_logger = logging.getLogger("waxlabs")


class Form(StatesGroup):
    unsubscribe = State()


@router.message(Command(commands=["stop"]))
@router.callback_query(StopCallback.filter())
async def stop_handler(message: Message | CallbackQuery, state: FSMContext):
    user_service = container[IUserService]

    from_user = message.from_user
    message = message.message if isinstance(message, CallbackQuery) else message

    user: UserExport | None = None

    try:
        if from_user:
            user = await user_service.get_by_telegram_account(from_user.username)
    except NoResultFound:
        pass

    if user:
        await state.update_data(unsubscribe=f"{user.wax_account}:{user.uuid}")
        await state.set_state(Form.unsubscribe)
        await message.reply(
            f"Are you sure you want to stop receiving notifications for {md.bold(user.wax_account)}?",
            reply_markup=ReplyKeyboardMarkup(
                keyboard=[
                    [
                        KeyboardButton(text="Yes"),
                        KeyboardButton(text="No"),
                    ]
                ],
                resize_keyboard=True,
            ),
            parse_mode=ParseMode.MARKDOWN,
        )
    else:
        await message.reply("I don't have any WAX account associated with your Telegram account.")


@router.message(Form.unsubscribe, F.text.casefold() == "no")
async def process_ignore_unsubscribe(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        "Ok, I won't unsubscribe you from any WAX account.",
        reply_markup=ReplyKeyboardRemove(),
    )


@router.message(Form.unsubscribe, F.text.casefold() == "yes")
async def process_and_create_user(message: Message, state: FSMContext, bot: Bot) -> None:
    user_service = container[IUserService]

    data = await state.get_data()
    wax_account, user_uuid = data.get("unsubscribe").split(":")
    await state.clear()

    bot_message = await message.answer(
        f"💾 Removing {md.bold(wax_account)} from my database...",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=ReplyKeyboardRemove(),
    )

    try:
        await user_service.disable(
            uuid=user_uuid,
        )

        await message.reply(
            "🗑 Done! I won't send you any more notifications for this account.",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
        )
    except Exception as e:
        _logger.exception("Removing WAX account failed: %s", exc_info=e)

        await bot.edit_message_text(
            "Darn it, something happened while I was trying to remove your WAX account 😔. Could you try again?",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            reply_markup=StopCallback.restart_markup(),
        )
