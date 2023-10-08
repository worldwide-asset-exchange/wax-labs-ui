from notifications.core.services.base_service import BaseService
from notifications.models.proposals import Proposal
from notifications.schemas.proposal_status import ProposalStatusExport


class IProposalService(BaseService[Proposal, ProposalStatusExport]):
    pass
