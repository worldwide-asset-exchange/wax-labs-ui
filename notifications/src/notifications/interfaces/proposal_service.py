import abc

from notifications.interfaces.base_service import IBaseService
from notifications.models.proposals import Proposal
from notifications.schemas.proposal_status import ProposalExport
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


class IProposalService(IBaseService[Proposal, ProposalExport], abc.ABC):
    table = Proposal
    table_export = ProposalExport

    @abc.abstractmethod
    async def update_status(self, wax_proposal: WaxProposal) -> None:
        pass

    @abc.abstractmethod
    async def create_from_wax_proposal(self, wax_proposal: WaxProposal) -> Proposal:
        pass

    @abc.abstractmethod
    async def proposal_exists(self, proposal_id: int) -> bool:
        pass

    @abc.abstractmethod
    async def get_by_proposal_id(self, proposal_id: int) -> ProposalExport:
        pass
