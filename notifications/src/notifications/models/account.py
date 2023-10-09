import typing
from datetime import datetime

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from notifications.core.models.abstract import BaseModel

if typing.TYPE_CHECKING:
    from .proposals import Subscription


class User(BaseModel):
    __tablename__: str = "users"

    name: Mapped[typing.Optional[str]] = mapped_column(String(160), nullable=True)
    telegram_account: Mapped[str] = mapped_column(String(160), index=True, nullable=False)
    wax_account: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    chat_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    deleted_at: Mapped[typing.Optional[datetime]] = mapped_column(nullable=True)

    subscriptions: Mapped["Subscription"] = relationship(back_populates="user", lazy="noload", uselist=True)
