from pydantic import UUID4
from sqlalchemy import func
from sqlalchemy.exc import NoResultFound

from notifications.core.services.base_service import BaseService, Data
from notifications.interfaces.user_service import IUserService
from notifications.models.account import User
from notifications.schemas.users import UserExport
from notifications.wax_interface.schemas.profile import Profile


class UserService(BaseService[User, UserExport], IUserService):
    table = User
    table_export = UserExport

    async def telegram_already_saved(self, telegram_account: str) -> bool:
        return await self.record_exists(self.table.telegram_account == telegram_account)

    async def wax_account_already_saved(self, wax_account: str, telegram_account: str) -> bool:
        return await self.record_exists(
            (self.table.wax_account == wax_account) & (self.table.telegram_account != telegram_account)
        )

    async def get_by_telegram_account(self, telegram_account: str, /, *, query_deleted: bool = False) -> UserExport:
        filters = func.lower(self.table.telegram_account) == telegram_account.lower()

        if not query_deleted:
            filters &= self.table.deleted_at.is_(None)

        return await self.get_by(filters)

    async def disable(self, telegram_account: str | None = None, uuid: UUID4 | None = None) -> None:
        user = (
            await self.get_by_telegram_account(telegram_account) if telegram_account else await self.get_by_uuid(uuid)
        )
        await self.update(
            uuid=user.uuid,
            update_dict={
                self.table.deleted_at: func.now(),
            },
        )

    async def enable(self, telegram_account: str | None = None, uuid: UUID4 | None = None) -> None:
        user = (
            await self.get_by_telegram_account(telegram_account) if telegram_account else await self.get_by_uuid(uuid)
        )

        await self.update(
            uuid=user.uuid,
            update_dict={
                self.table.deleted_at: None,
            },
        )

    async def enable_or_create(self, telegram_account: str, data: Data) -> None:
        try:
            user = await self.get_by_telegram_account(telegram_account)

            await self.enable(uuid=user.uuid)
        except NoResultFound:
            await self.create(data=data)

    async def create_from_wax_profile(self, wax_profile: Profile) -> None:
        try:
            await self.get_by(
                self.table.wax_account == wax_profile.wax_account,
            )
        except NoResultFound:
            await self.create(
                data={
                    self.table.wax_account: wax_profile.wax_account,
                    self.table.telegram_account: wax_profile.contact,
                    self.table.name: wax_profile.full_name,
                    self.table.deleted_at: None,
                    self.table.chat_id: None,
                },
            )
