import typing
from datetime import datetime
from uuid import UUID

from sqlalchemy import func, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql.schema import MetaData

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class BaseModel(DeclarativeBase):
    uuid: Mapped[UUID] = mapped_column(
        primary_key=True,
        autoincrement=False,
        server_default=text("uuid_generate_v4()"),
        nullable=False,
        unique=True,
    )

    created_at: Mapped[datetime] = mapped_column(insert_default=func.now(), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_onupdate=func.now(), onupdate=func.now())

    metadata = MetaData(naming_convention=convention)

    def dict(self) -> dict[str, typing.Any]:
        final_dict = {}

        try:
            for col in self.__mapper__.persist_selectable.c:
                final_dict[col.name] = getattr(self, col.name, None)
        except (KeyError, AttributeError):
            pass
        finally:
            return final_dict
