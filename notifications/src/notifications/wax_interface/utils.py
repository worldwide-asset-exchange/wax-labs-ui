from notifications.wax_interface.schemas.types import ProposalStatus, ProposalStatusKey


def to_proposal_status(status_key: ProposalStatusKey) -> ProposalStatus:
    match status_key:
        case ProposalStatusKey.DRAFTING:
            return ProposalStatus.DRAFTING
        case ProposalStatusKey.SUBMITTED:
            return ProposalStatus.REVIEW
        case ProposalStatusKey.APPROVED:
            return ProposalStatus.APPROVED
        case ProposalStatusKey.VOTING:
            return ProposalStatus.VOTING
        case ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS:
            return ProposalStatus.IN_PROGRESS
        case ProposalStatusKey.FAILED_OR_CLAIMED:
            return ProposalStatus.REJECTED
        case ProposalStatusKey.FAILED_DRAFT:
            return ProposalStatus.FAILED_DRAFT
        case ProposalStatusKey.CANCELLED:
            return ProposalStatus.CANCELLED
        case _:
            return ProposalStatus.COMPLETE
