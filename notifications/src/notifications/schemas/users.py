from pydantic import UUID4

from notifications.core.schemas.base import BaseSchema


class UserExport(BaseSchema):
    uuid: UUID4
    name: str
    telegram_account: str
    wax_account: str
    chat_id: int


class UserCreate(BaseSchema):
    pass
