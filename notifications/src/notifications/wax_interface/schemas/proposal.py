import typing

from pydantic import BaseModel, field_validator

from notifications.wax_interface.schemas.types import BallotOptions, ProposalStatus, ProposalStatusKey
from notifications.wax_interface.utils import to_proposal_status


class Proposal(BaseModel):
    proposal_id: int
    proposer: str
    category: int
    status: ProposalStatusKey
    human_status: ProposalStatus
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

    @classmethod
    @field_validator("human_status", mode="before")
    def validate_human_status(cls, _, values):
        return to_proposal_status(values["status"])
