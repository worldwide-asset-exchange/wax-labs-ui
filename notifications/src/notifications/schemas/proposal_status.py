from pydantic import UUID4

from notifications.core.schemas.base import BaseSchema
from notifications.wax_interface.schemas.types import ProposalStatus


class ProposalExport(BaseSchema):
    uuid: UUID4
    proposal_id: int
    author: str
    status: ProposalStatus | None = None
