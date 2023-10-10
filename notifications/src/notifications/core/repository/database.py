import importlib
import logging
from contextlib import asynccontextmanager
from typing import AsyncContextManager

from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from notifications import PACKAGE_BASE_DIR
from notifications.core.repository import IDatabase
from notifications.settings import cfg


class Database(IDatabase):
    def __init__(self, override_db_name: str | None = None) -> None:
        self._engine: AsyncEngine | None = None
        self._session_factory = None
        self._session_klass: AsyncSession | None = None
        self.create_session(override_db_name)
        self._logger = logging.getLogger("waxlabs")

    @staticmethod
    def connection_string(
        override_db_name: str | None = None,
        override_driver: str | None = None,
        dump_connection_string: bool = False,
    ) -> str:
        db_password = cfg.db_password.get_secret_value()

        connection_string = URL.create(
            drivername=override_driver or cfg.db_driver_name,
            database=override_db_name or cfg.db_name,
            username=cfg.db_user,
            password=db_password,
            host=cfg.db_host,
            port=cfg.db_port,
        ).render_as_string(hide_password=False)

        if dump_connection_string:
            connection_string = connection_string.replace("%", "%%")

        return connection_string

    def create_session(self, override_db_name: str | None = None):
        options = dict(
            future=True,
        )

        if not cfg.testing:
            options.update(
                {
                    "pool_pre_ping": True,
                    "pool_size": 20,
                    "max_overflow": 5,
                    "pool_recycle": 300,
                }
            )

        self._engine: AsyncEngine = create_async_engine(
            self.connection_string(override_db_name),
            **options,
        )

        self._session_klass = async_sessionmaker(
            bind=self._engine,
            autoflush=False,
            expire_on_commit=False,
        )

    async def create_database(self) -> None:
        from sqlalchemy import text

        from notifications.core.models.abstract import BaseModel

        self.bring_models_to_scope()

        async with self._engine.begin() as conn:
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
            await conn.run_sync(BaseModel.metadata.create_all)

    @asynccontextmanager
    async def session(self, db_session: AsyncSession | None = None) -> AsyncContextManager[AsyncSession]:
        if db_session is not None:
            yield db_session
        else:
            async with self._session_klass.begin() as async_session:
                yield async_session

    @asynccontextmanager
    async def nested_session(self, db_session: AsyncSession | None = None) -> AsyncContextManager[AsyncSession]:
        if db_session is not None:
            yield db_session
        else:
            async with self._session_klass.begin_nested() as async_session:
                yield async_session

    @property
    def engine(self) -> AsyncEngine:
        return self._engine

    @engine.setter
    def engine(self, value):
        self._engine = value

    @property
    def session_klass(self) -> AsyncSession:
        return self._session_klass

    @session_klass.setter
    def session_klass(self, value):
        self._session_klass = value

    async def safe_dispose(self):
        try:
            self._logger.info("Shutting down all connections from the pool")
            await self.engine.dispose()
        except Exception as ex:
            self._logger.error("Error while closing all connections", exc_info=ex)

    @staticmethod
    def bring_models_to_scope():
        models_folder = PACKAGE_BASE_DIR / "models"

        for file_path in models_folder.glob("*.py"):
            if "__init__" in str(file_path):
                continue

            relative_models_path = str(file_path).split("src")[1].strip("/").split(".")[0]
            models_import_path = relative_models_path.replace("/", ".")

            importlib.import_module(models_import_path)
