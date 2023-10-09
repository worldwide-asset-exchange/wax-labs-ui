import typing

from pydantic import BaseModel

from notifications.wax_interface.schemas.types import BallotOptions, ProposalStatus


class Proposal(BaseModel):
    proposal_id: int
    proposer: str
    category: int
    status: ProposalStatus
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
