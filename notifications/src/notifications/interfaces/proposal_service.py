import abc

from notifications.interfaces.base_service import IBaseService
from notifications.models.proposals import Proposal
from notifications.schemas.proposal_status import ProposalStatusExport
from notifications.wax_interface.schemas.proposal import Proposal as WaxProposal


class IProposalService(IBaseService[Proposal, ProposalStatusExport], abc.ABC):
    @abc.abstractmethod
    async def update_status(self, wax_proposal: WaxProposal) -> None:
        pass

    @abc.abstractmethod
    async def create_from_wax_proposal(self, wax_proposal: WaxProposal) -> Proposal:
        pass
