from pydantic import UUID4

from notifications.core.schemas.base import BaseSchema


class SubscriptionExport(BaseSchema):
    uuid: UUID4
    name: str
    telegram_account: str
    wax_account: str
    chat_id: str
