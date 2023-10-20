import abc
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession


class IDatabase(abc.ABC):
    @abc.abstractmethod
    def create_database(self) -> None:
        pass

    @abc.abstractmethod
    def create_session(self, override_db_name: str | None = None) -> None:
        pass

    @abc.abstractmethod
    @asynccontextmanager
    async def session(self, db_session: AsyncSession | None = None) -> AsyncSession:
        pass

    @asynccontextmanager
    async def nested_session(self, db_session: AsyncSession | None = None) -> AsyncSession:
        pass

    @abc.abstractmethod
    async def safe_dispose(self):
        pass

    @staticmethod
    @abc.abstractmethod
    def connection_string(override_db_name: str | None = None, override_driver: str | None = None) -> str:
        pass

    @property
    @abc.abstractmethod
    def engine(self) -> AsyncEngine:
        pass

    @property
    @abc.abstractmethod
    def session_klass(self) -> AsyncSession:
        pass
