import abc
import typing
import typing as t

from pydantic import UUID4
from sqlalchemy import Column
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql import Select
from sqlalchemy.sql.elements import ColumnElement

from notifications.core.schemas.common import E, T
from notifications.models.account import User

CurrentUserIdentifier = User | int | None


class IBaseService(abc.ABC, t.Generic[T, E]):
    table: typing.Type[T]
    table_export: t.Type[E]
    table_filter: t.Type[E] | None = None

    @abc.abstractmethod
    def get_queryset(self) -> Select:
        pass

    @abc.abstractmethod
    def delete_queryset(self) -> Select:
        pass

    @abc.abstractmethod
    async def get_uuid_by(
        self,
        filters: ColumnElement[bool],
        db_session: AsyncSession = None,
    ) -> int:
        pass

    @abc.abstractmethod
    async def record_exists(
        self,
        filters: ColumnElement[bool],
        db_session: AsyncSession = None,
    ) -> bool:
        pass

    @abc.abstractmethod
    async def get_by(self, filters: ColumnElement[bool], /, db_session: AsyncSession = None) -> E:
        pass

    @abc.abstractmethod
    async def get_by_uuid(self, uuid: UUID4) -> E:
        pass

    @abc.abstractmethod
    async def create(
        self,
        data: dict[str | Column | InstrumentedAttribute, t.Any, T],
        current_user: CurrentUserIdentifier = None,
        return_raw: bool = False,
        db_session: AsyncSession = None,
    ) -> E | T:
        pass

    @abc.abstractmethod
    async def all(
        self,
        filters: ColumnElement[bool] | None = None,
        return_raw: bool = False,
        current_user: CurrentUserIdentifier = None,
        db_session: AsyncSession = None,
    ) -> list[E] | list[T]:
        pass

    @abc.abstractmethod
    async def save(
        self,
        instance: T,
        update_instance: dict[str | Column, t.Any],
        current_user: CurrentUserIdentifier = None,
        create: bool = False,
        return_raw: bool = False,
        db_session: AsyncSession = None,
    ) -> E | T:
        pass

    @abc.abstractmethod
    async def update(
        self,
        uuid: UUID4,
        update_dict: dict[str | InstrumentedAttribute, t.Any],
        return_entity: bool = True,
        db_session: AsyncSession = None,
    ) -> E | None:
        pass

    @abc.abstractmethod
    async def update_as(
        self,
        filters: ColumnElement[bool],
        update_dict: dict[str | Column | InstrumentedAttribute, t.Any],
        current_user: CurrentUserIdentifier = None,
        synchronize_session: bool = True,
        db_session: AsyncSession = None,
    ) -> None:
        pass

    @abc.abstractmethod
    async def delete(self, uuid: UUID4, db_session: AsyncSession | None = None) -> T:
        pass

    @abc.abstractmethod
    async def export(self, instance: T, **kwargs) -> E:
        pass

    @abc.abstractmethod
    async def export_pagination(self, rows: list[T]):
        pass

    @staticmethod
    @abc.abstractmethod
    def to_dict(instance: T) -> dict[str, typing.Any]:
        pass

    @abc.abstractmethod
    async def dispose(self):
        pass
