import typing

from pydantic import Field

from notifications.core.schemas.base import BaseSchema


class Error(BaseSchema):
    code: str
    location: list[str | int]
    msg_template: str
    ctx: dict[str, typing.Any] | None = Field(default_factory=dict)

    def __str__(self) -> str:
        return self.msg_template.format(**(self.ctx or {}))
