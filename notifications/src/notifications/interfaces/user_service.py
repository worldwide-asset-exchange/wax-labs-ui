import abc
import typing

from pydantic import UUID4
from sqlalchemy import Column
from sqlalchemy.orm import InstrumentedAttribute

from notifications.interfaces.base_service import IBaseService
from notifications.models.account import User
from notifications.schemas.users import UserExport


class IUserService(IBaseService[User, UserExport]):
    @abc.abstractmethod
    async def telegram_already_saved(self, telegram_account: str) -> bool:
        pass

    @abc.abstractmethod
    async def wax_account_already_saved(self, wax_account: str, telegram_account: str) -> bool:
        pass

    @abc.abstractmethod
    async def get_by_telegram_account(self, telegram_account: str, /, *, query_deleted: bool = False) -> UserExport:
        pass

    @abc.abstractmethod
    async def disable(self, telegram_account: str | None = None, uuid: UUID4 | None = None) -> None:
        pass

    @abc.abstractmethod
    async def enable(self, telegram_account: str | None = None, uuid: UUID4 | None = None) -> None:
        pass

    @abc.abstractmethod
    async def enable_or_create(
        self,
        telegram_account: str,
        data: dict[str | Column | InstrumentedAttribute, typing.Any],
    ) -> None:
        pass
