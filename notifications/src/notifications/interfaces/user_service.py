import abc

from notifications.interfaces.base_service import IBaseService
from notifications.models.account import User
from notifications.schemas.users import UserExport


class IUserService(IBaseService[User, UserExport]):
    @abc.abstractmethod
    async def user_already_saved(self, telegram_account: str) -> bool:
        pass

    @abc.abstractmethod
    async def get_by_telegram_account(self, telegram_account: str) -> UserExport:
        pass
