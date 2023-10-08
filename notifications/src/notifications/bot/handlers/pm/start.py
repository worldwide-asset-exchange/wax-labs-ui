from aiogram import Bot, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from sqlalchemy.exc import NoResultFound

from notifications.container import container
from notifications.interfaces.user_service import IUserService

START_MESSAGE = """
Hello {}, 

How can I help you today?
"""

router = Router()


@router.message(Command(commands=["start"]))
async def start_handler(message: Message, state: FSMContext, bot: Bot):
    user_service = container[IUserService]
    # subscription_service = container[ISubscriptionService]

    try:
        if message.from_user:
            await user_service.get_by_telegram_account(message.from_user.username)
    except NoResultFound:
        await user_service.create(
            data={
                user_service.table.name: message.from_user.full_name,
                user_service.table.telegram_account: message.from_user.username,
                user_service.table.chat_id: message.chat.id,
            }
        )

    # subscriptions = await subscription_service.all(
    #     filters=subscription_service.table
    # )

    # keyboard = InlineKeyboardMarkup()
    # keyboard.add(InlineKeyboardButton("Show available commands", callback_data="get-help"))
    #
    # async with bot.retrieve_data(user_id=message.from_user.id) as data:
    #     if not data:
    #         data["state_initialized"] = True
    #
    # await bot.send_message(
    #     chat_id=message.chat.id,
    #     text=START_MESSAGE.format(message.from_user.full_name),
    #     reply_markup=keyboard,
    # )
