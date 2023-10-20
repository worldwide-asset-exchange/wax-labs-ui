import logging

from aiogram import Bot, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardMarkup,
    KeyboardButton,
    Message,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
)
from aiogram.utils import markdown as md
from pydantic import UUID4
from sqlalchemy.exc import NoResultFound

from notifications.bot.handlers.callback_data.help import HelpCallback
from notifications.bot.handlers.callback_data.start import StartCallback
from notifications.bot.utils import get_args
from notifications.container import container
from notifications.interfaces.user_service import IUserService
from notifications.schemas.users import UserExport

router = Router()

_logger = logging.getLogger("waxlabs")


class Form(StatesGroup):
    wax_account = State()
    is_that_correct = State()
    keep_current_wax_account = State()


async def _verify_wax_account(wax_account: str, message: Message, state: FSMContext, uuid: UUID4 | None = None):
    await state.update_data(wax_account=f"{wax_account}:{uuid or ''}")
    await state.set_state(Form.is_that_correct)
    await message.reply(
        f"Is your WAX account {md.bold(wax_account)} correct? You won't be able to use this service if it isn't.",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [
                    KeyboardButton(text="Yes"),
                    KeyboardButton(text="No"),
                ]
            ],
            resize_keyboard=True,
            one_time_keyboard=True,
        ),
        parse_mode=ParseMode.MARKDOWN,
    )


@router.message(Command(commands=["start"]))
@router.callback_query(StartCallback.filter())
async def start_handler(message: Message | CallbackQuery, state: FSMContext):
    from_user = message.from_user
    message = message.message if isinstance(message, CallbackQuery) else message

    user_service = container[IUserService]

    welcome_message: str | None = None
    user: UserExport | None = None
    markup: InlineKeyboardMarkup | None = None
    wax_account = get_args(message).lower()
    current_uuid: UUID4 | None = None

    try:
        if from_user:
            user = await user_service.get_by_telegram_account(from_user.username, query_deleted=True)

            if user.chat_id is None:
                await user_service.update(user.uuid, update_dict={user_service.table.chat_id: message.chat.id})

            if user.deleted_at is None:
                welcome_message = f"""Hello {from_user.full_name} 👋! \nHow can I help you today?"""
            else:
                current_uuid = user.uuid
                user = None

                raise NoResultFound()

    except NoResultFound:
        if not wax_account:
            welcome_message = (
                f"Hello {from_user.full_name} 👋! \n\nI don't know you yet, could you please send me your wax account?"
            )

    if user:
        markup = HelpCallback.help_markup()
    elif wax_account:
        await _verify_wax_account(wax_account, message, state, uuid=current_uuid)
    else:
        await state.set_state(Form.wax_account)

    if welcome_message:
        await message.answer(
            text=welcome_message,
            reply_markup=markup,
        )


@router.message(Command(commands=["cancel"]))
@router.callback_query(StartCallback.filter())
async def cancel_handler(message: Message, state: FSMContext):
    await state.clear()

    await message.answer(
        "Ok, I stopped the process of saving your WAX account.",
        reply_markup=ReplyKeyboardRemove(),
    )


@router.message(Form.wax_account)
async def verify_wax_account_handler(message: Message, state: FSMContext, bot: Bot) -> None:
    user_service = container[IUserService]

    from_user = message.from_user.username
    wax_account = message.text.strip().lower()

    if not wax_account or await user_service.wax_account_already_saved(wax_account, from_user):
        await message.answer(
            f"Looks like something happened while I was trying to save your WAX account {wax_account} 😔. Could you"
            " verify it and try again?",
            reply_markup=StartCallback.restart_markup(),
        )

        return

    await _verify_wax_account(wax_account, message, state)


@router.message(Form.is_that_correct, F.text.casefold() == "no")
async def process_restart_wax_account(message: Message, state: FSMContext) -> None:
    await state.clear()
    await state.set_state(Form.wax_account)
    await message.answer(
        "Since this is not your current WAX account, could you please send me the correct one?",
        reply_markup=ReplyKeyboardRemove(),
    )


@router.message(Form.is_that_correct, F.text.casefold() == "yes")
async def process_and_create_user(message: Message, state: FSMContext, bot: Bot) -> None:
    user_service = container[IUserService]

    data = await state.get_data()
    wax_account, current_uuid = data.get("wax_account").split(":")
    await state.clear()

    bot_message = await message.answer(
        f"💾 Saving your WAX account {md.bold(wax_account)}, just a second...",
        parse_mode=ParseMode.MARKDOWN,
    )

    try:
        await user_service.enable_or_create(
            telegram_account=message.from_user.username,
            data={
                user_service.table.name: message.from_user.full_name,
                user_service.table.telegram_account: message.from_user.username,
                user_service.table.chat_id: message.chat.id,
                user_service.table.wax_account: wax_account,
            },
        )

        await bot.edit_message_text(
            "I saved your WAX account 🎉 and now I can send you updates on your proposals",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            reply_markup=HelpCallback.help_markup(),
        )
    except Exception as e:
        _logger.exception("Saving WAX account failed", exc_info=e)

        await bot.edit_message_text(
            "😖 Darn it, something happened while I was trying to save your WAX account. Could you try again?",
            message_id=bot_message.message_id,
            chat_id=bot_message.chat.id,
            reply_markup=StartCallback.restart_markup(),
        )
