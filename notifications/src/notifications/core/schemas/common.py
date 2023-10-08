import typing as t

from pydantic import Field

from notifications.core.models.abstract import BaseModel
from notifications.core.schemas.base import BaseSchema

T = t.TypeVar("T", bound=BaseModel)
E = t.TypeVar("E", bound=BaseSchema)
GenericPydanticModel = t.TypeVar("GenericPydanticModel", bound=BaseSchema)
GenericPaginationModelExport = t.TypeVar("GenericPaginationModelExport", bound=BaseSchema)


class DetailModel(BaseSchema):
    loc: list[str] = Field(default_factory=list)
    msg: str
    type: t.Literal["error", "success"]

    @classmethod
    def success(cls, msg: str, loc: list[str] | None = None):
        return cls(msg=msg, type="success", loc=loc or [])

    @classmethod
    def error(cls, msg: str, loc: list[str] | None = None):
        return cls(msg=msg, type="error", loc=loc or [])


class Message(BaseSchema):
    detail: list[DetailModel]

    @classmethod
    def create(cls, msg: str):
        return cls(
            detail=[
                DetailModel.success(msg=msg),
            ]
        )


class ErrorModel(BaseSchema):
    detail: list[DetailModel]

    @classmethod
    def create(cls, msg):
        return cls(
            detail=[
                DetailModel.error(msg=msg),
            ]
        )
