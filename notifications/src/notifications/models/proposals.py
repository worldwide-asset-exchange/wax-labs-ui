import typing

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from notifications.core.models.abstract import BaseModel

if typing.TYPE_CHECKING:
    from .account import User


class Subscription(BaseModel):
    __tablename__ = "subscriptions"

    proposal_id = mapped_column(ForeignKey("proposal_statuses.proposal_id"), unique=True)

    user_id = mapped_column(ForeignKey("users.uuid"))
    user: Mapped["User"] = relationship(back_populates="subscriptions", lazy="noload")

    proposal_statuses: Mapped["ProposalStatus"] = relationship(back_populates="subscriptions", lazy="noload")


class ProposalStatus(BaseModel):
    __tablename__ = "proposal_statuses"

    proposal_id: Mapped[int] = mapped_column(nullable=False, unique=True)
    author: Mapped[str] = mapped_column(String(length=15), nullable=False)

    subscriptions: Mapped["Subscription"] = relationship(back_populates="proposal_statuses", lazy="noload")

    status: Mapped[typing.Optional[str]] = mapped_column(String(length=60), nullable=True)
