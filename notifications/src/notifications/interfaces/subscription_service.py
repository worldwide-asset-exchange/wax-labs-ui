import abc

from pydantic import UUID4

from notifications.interfaces.base_service import IBaseService
from notifications.models.proposals import Subscription
from notifications.schemas.subscription import SubscriptionExport
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


class ISubscriptionService(IBaseService[Subscription, SubscriptionExport], abc.ABC):
    table = Subscription
    table_export = SubscriptionExport

    @abc.abstractmethod
    async def create_from_wax_proposal(self, wax_proposal: WaxProposal, user_uuid: UUID4) -> Subscription:
        pass
