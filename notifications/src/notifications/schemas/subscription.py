from datetime import datetime

from pydantic import UUID4

from notifications.core.schemas.base import BaseSchema


class SubscriptionExport(BaseSchema):
    uuid: UUID4
    proposal_id: int
    user_id: UUID4
    created_at: datetime | None = None
    updated_at: datetime | None = None
