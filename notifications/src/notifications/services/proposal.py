from sqlalchemy.exc import NoResultFound

from notifications.core.repository import IDatabase
from notifications.core.services.base_service import BaseService
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.models.proposals import Proposal
from notifications.schemas.proposal_status import ProposalExport
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


class ProposalService(BaseService[Proposal, ProposalExport], IProposalService):
    table = Proposal
    table_export = ProposalExport

    def __init__(self, database: IDatabase, subscription_service: ISubscriptionService):
        super().__init__(database)

        self.subscription_service = subscription_service

    async def update_status(self, wax_proposal: WaxProposal) -> None:
        proposal = await self.create_from_wax_proposal(wax_proposal)

        if proposal.status != wax_proposal.status:
            await self.update(
                uuid=wax_proposal.uuid,
                update_dict={
                    self.table.status: wax_proposal.status,
                },
            )

    async def create_from_wax_proposal(self, wax_proposal: WaxProposal) -> Proposal:
        try:
            proposal = await self.get_raw_by(
                self.table.proposal_id == wax_proposal.proposal_id,
            )
        except NoResultFound:
            proposal = await self.create(
                data={
                    self.table.proposal_id: wax_proposal.proposal_id,
                    self.table.status: wax_proposal.status,
                    self.table.author: wax_proposal.proposer,
                },
                return_raw=True,
            )

        return proposal

    async def proposal_exists(self, proposal_id: int) -> bool:
        return await self.record_exists(self.table.proposal_id == proposal_id)

    async def get_by_proposal_id(self, proposal_id: int) -> ProposalExport:
        return await self.get_by(self.table.proposal_id == proposal_id)
