import enum

from pydantic import BaseModel


class ProposalStatus(enum.Enum):
    DRAFTING = 1
    SUBMITTED = 2
    APPROVED = 3
    VOTING = 4
    IN_PROGRESS = 5
    FAILED = 6
    CANCELLED = 7
    COMPLETED = 8
    FAILED_DRAFT = 9

    def to_human_status(self):
        return " ".join(self.name.capitalize().split("_"))


class DeliverableStatus(enum.Enum):
    DRAFTING = 1
    IN_PROGRESS = 2
    REPORTED = 3
    VOTING = 4
    ACCEPTED = 5
    REJECTED = 6
    CLAIMED = 7


class BallotOptions(BaseModel):
    key: str
    value: str
