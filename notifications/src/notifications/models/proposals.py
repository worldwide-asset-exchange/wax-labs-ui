import typing

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from notifications.core.models.abstract import BaseModel
from notifications.wax_interface.schemas.types import ProposalStatus

if typing.TYPE_CHECKING:
    from .account import User


class Subscription(BaseModel):
    __tablename__ = "subscriptions"

    proposal_id = mapped_column(ForeignKey("proposals.proposal_id"), unique=True)
    proposal: Mapped["Proposal"] = relationship(back_populates="subscriptions", lazy="noload")

    user_id = mapped_column(ForeignKey("users.uuid"))
    user: Mapped["User"] = relationship(back_populates="subscriptions", lazy="noload")


class Proposal(BaseModel):
    __tablename__ = "proposals"

    proposal_id: Mapped[int] = mapped_column(nullable=False, unique=True)
    author: Mapped[str] = mapped_column(String(length=15), nullable=False)
    status: Mapped[typing.Optional[ProposalStatus]] = mapped_column(nullable=True)

    subscriptions: Mapped["Subscription"] = relationship(back_populates="proposal", lazy="noload")
