from pydantic import UUID4
from sqlalchemy.exc import NoResultFound

from notifications.core.services.base_service import BaseService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.models.proposals import Subscription
from notifications.schemas.subscription import SubscriptionExport
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


class SubscriptionService(BaseService[Subscription, SubscriptionExport], ISubscriptionService):
    table = Subscription
    table_export = SubscriptionExport

    async def create_from_wax_proposal(self, wax_proposal: WaxProposal, user_uuid: UUID4) -> None:
        await self.subscribe_to_proposal(proposal_id=wax_proposal.proposal_id, user_uuid=user_uuid)

    async def subscribe_to_proposal(self, proposal_id: int, user_uuid: UUID4) -> None:
        try:
            await self.get_raw_by((self.table.proposal_id == proposal_id) & (self.table.user_id == user_uuid))
        except NoResultFound:
            await self.create(
                data={
                    self.table.proposal_id: proposal_id,
                    self.table.user_id: user_uuid,
                },
                return_raw=True,
            )
