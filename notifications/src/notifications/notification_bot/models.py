import enum
import typing

from pydantic import BaseModel


class ProposalStatusKey(enum.Enum):
    DRAFTING = 1
    SUBMITTED_OR_DELIVERABLE_IN_PROGRESS = 2
    APPROVED_OR_REPORTED = 3
    VOTING_OR_ACCEPTED = 4
    REJECTED_OR_PROPOSAL_IN_PROGRESS = 5
    FAILED_OR_CLAIMED = 6
    CANCELLED = 7
    COMPLETED = 8
    FAILED_DRAFT = 9


class ProposalStatus(enum.Enum):
    DRAFTING = "in drafting"
    REVIEW = "in review"
    APPROVED = "approved"
    VOTING = "in voting"
    IN_PROGRESS = "in progress"
    CANCELLED = "cancelled"
    REJECTED = "rejected"
    COMPLETE = "completed"
    FAILED_DRAFT = "to be improved"


class BallotOptions(BaseModel):
    key: str
    value: str


class Proposal(BaseModel):
    proposal_id: int
    proposer: str
    category: int
    status: ProposalStatusKey
    ballot_name: str
    title: str
    description: str
    image_url: str
    estimated_time: int
    total_requested_funds: str
    to_be_paid_funds: str
    total_paid_funds: str
    remaining_funds: str
    deliverables: int
    deliverables_completed: int
    reviewer: str
    ballot_results: list[BallotOptions]
    update_ts: str
    vote_end_time: str
    road_map: str
    categories: dict[str, typing.Any] | None = None
