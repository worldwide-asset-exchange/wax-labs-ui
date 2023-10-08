from sqlalchemy import func

from notifications.core.services.base_service import BaseService
from notifications.interfaces.user_service import IUserService
from notifications.models.account import User
from notifications.schemas.users import UserExport


class UserService(BaseService[User, UserExport], IUserService):
    table = User
    table_export = UserExport

    async def telegram_already_saved(self, telegram_account: str) -> bool:
        return await self.record_exists(self.table.telegram_account == telegram_account)

    async def wax_account_already_saved(self, wax_account: str) -> bool:
        return await self.record_exists(self.table.wax_account == wax_account)

    async def get_by_telegram_account(self, telegram_account: str) -> UserExport:
        return await self.get_by(func.lower(self.table.telegram_account) == telegram_account.lower())
