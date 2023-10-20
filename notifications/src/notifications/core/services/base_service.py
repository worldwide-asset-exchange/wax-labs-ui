import logging
import typing
from datetime import datetime, timezone

from pydantic import UUID4, TypeAdapter
from sqlalchemy import Column, exists, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql import Select
from sqlalchemy.sql.elements import ColumnElement

from notifications.core.repository import IDatabase
from notifications.core.schemas.common import E, T
from notifications.models.account import User

CurrentUserIdentifier = User | int | None

Data: typing.TypeAlias = dict[str | Column | InstrumentedAttribute, typing.Any]


class BaseService(typing.Generic[T, E]):
    table: typing.Type[T]
    table_export: typing.Type[E]
    table_filter: typing.Type[E] | None = None

    max_page_size: int = 1000

    def __init__(self, database: IDatabase):
        self._database = database
        self._logger = logging.getLogger("waxlabs")

        self._adapter = TypeAdapter(list[self.table_export])

    def get_queryset(self) -> Select:
        return select(self.table)

    def delete_queryset(self) -> Select:
        return self.get_queryset()

    async def get_uuid_by(
        self,
        filters: ColumnElement[bool],
        db_session: AsyncSession = None,
    ) -> int:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = select(self.table.uuid).select_from(self.table).where(filters).limit(1)
            response = await async_session.execute(stmt)
            return response.scalar_one()

    async def record_exists(
        self,
        filters: ColumnElement[bool],
        db_session: AsyncSession = None,
    ) -> bool:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = exists(self.table).select_from(self.table).where(filters).select()
            return await async_session.scalar(stmt)

    async def get_by(
        self,
        filters: ColumnElement[bool],
        /,
        db_session: AsyncSession = None,
    ) -> E:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = self.get_queryset().where(filters).limit(1)
            result = await async_session.execute(stmt)
            instance = result.scalar_one()
            return await self.export(instance)

    async def get_raw_by(
        self,
        filters: ColumnElement[bool],
        /,
        db_session: AsyncSession = None,
    ) -> T:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = self.get_queryset().where(filters).limit(1)
            result = await async_session.execute(stmt)
            return result.scalar_one()

    async def get_by_uuid(self, uuid: UUID4) -> E:
        return await self.get_by(self.table.uuid == uuid)

    async def create(
        self,
        data: Data,
        current_user: CurrentUserIdentifier = None,
        return_raw: bool = False,
        db_session: AsyncSession = None,
    ) -> E | T:
        return await self.save(
            instance=self.table(),
            update_instance=data,
            current_user=current_user,
            create=True,
            return_raw=return_raw,
            db_session=db_session,
        )

    async def all(
        self,
        filters: ColumnElement[bool] | None = None,
        return_raw: bool = False,
        db_session: AsyncSession = None,
    ) -> list[E] | list[T]:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = self.get_queryset().order_by(self.table.uuid)

            if filters is not None:
                stmt = stmt.where(filters)

            rows = await async_session.scalars(stmt)

            if return_raw:
                return list(rows)

            rows = await self.export_pagination(list(rows))
            return typing.cast(list[T], rows)

    async def save(
        self,
        instance: T,
        update_instance: dict[str | Column, typing.Any],
        current_user: CurrentUserIdentifier = None,
        create: bool = False,
        return_raw: bool = False,
        db_session: AsyncSession = None,
    ) -> E | T:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            instance = self._generate_update_dict(
                update_dict=update_instance,
                instance=instance,
            )

            if instance not in async_session:
                instance = await async_session.merge(instance)

            async_session.add(instance)
            if not async_session.in_nested_transaction():
                await async_session.commit()

            if return_raw:
                return instance

            return await self.export(instance)

    async def update(
        self,
        uuid: UUID4,
        update_dict: Data,
        return_entity: bool = False,
        db_session: AsyncSession = None,
    ) -> E | None:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            _update = self._generate_update_dict(update_dict)

            if not _update:
                raise ValueError("Empty update dict")

            stmt = update(self.table).where(self.table.uuid == uuid).values(**_update)
            await async_session.execute(stmt)

            if not async_session.in_nested_transaction():
                await async_session.commit()

        if return_entity:
            return await self.get_by(self.table.uuid == uuid)

    async def update_as(
        self,
        filters: ColumnElement[bool],
        update_dict: Data,
        current_user: CurrentUserIdentifier = None,
        synchronize_session: bool = True,
        db_session: AsyncSession = None,
    ) -> None:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            _update = self._generate_update_dict(update_dict)

            if not _update:
                raise ValueError("Empty update dict")

            stmt = update(self.table).where(filters).values(**_update)

            if not synchronize_session:
                stmt = stmt.execution_options(synchronize_session=False)

            await async_session.execute(stmt)

            if not async_session.in_nested_transaction():
                await async_session.commit()

    async def delete(
        self,
        uuid: UUID4,
        db_session: AsyncSession | None = None,
    ) -> T:
        async_session: AsyncSession

        async with self._database.session(db_session) as async_session:
            stmt = self.delete_queryset().where(self.table.uuid == uuid).limit(1)
            result = await async_session.execute(stmt)
            entity = result.scalar_one()

            if entity:
                self.to_dict(entity)

                await async_session.delete(entity)

                if not async_session.in_nested_transaction():
                    await async_session.commit()

                return entity

    async def export(self, instance: T, **kwargs) -> E:
        return self.table_export.model_validate(instance, from_attributes=True)

    async def export_pagination(self, rows: list[T]):
        return self._adapter.validate_python(rows, from_attributes=True)

    @staticmethod
    def to_dict(instance: T) -> dict[str, typing.Any]:
        return instance.dict()

    async def dispose(self):
        await self._database.safe_dispose()

    def _generate_update_dict(
        self,
        update_dict: Data,
        instance: T | None = None,
    ):
        _update = instance if instance else {}

        for column_name, value in update_dict.items():
            column = (
                column_name
                if isinstance(column_name, InstrumentedAttribute) or isinstance(column_name, Column)
                else getattr(self.table, column_name, None)
            )

            if isinstance(value, datetime) and not value.tzinfo:
                value = value.replace(tzinfo=timezone.utc)

            if value is None and column.nullable:
                if instance:
                    setattr(_update, column.name, None)
                else:
                    _update[column.name] = None
            elif value is not None:
                if instance:
                    setattr(_update, column.name, value)
                else:
                    _update[column.name] = value

        return _update
