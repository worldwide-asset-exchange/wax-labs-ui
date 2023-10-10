from urllib.parse import urljoin

from aiogram.types import Message
from aiogram.utils import markdown as md

from notifications.settings import cfg
from notifications.wax_interface.schemas.types import ProposalStatus


def proposal_status_to_message(proposal_id: int, status: ProposalStatus) -> str:
    status_to_message = _status_to_message(status)

    proposal_url = urljoin(cfg.wax_labs_proposal_base_url, str(proposal_id))

    if status == ProposalStatus.DRAFTING:
        return (
            f"The status of {md.link(f'proposal {proposal_id}', proposal_url)} is"
            f" {md.bold(status.to_human_status())}: \n\n{status_to_message}\n\n"
        )

    return (
        f"The {md.link(f'proposal {proposal_id}', proposal_url)} was updated to"
        f" {md.bold(status.to_human_status())}: \n\n{status_to_message}\n\n"
    )


def _status_to_message(status: ProposalStatus) -> str:
    match status:
        case ProposalStatus.DRAFTING:
            return "📝 This proposal is still being drafted and is not ready for review."
        case ProposalStatus.SUBMITTED:
            return "🕵️‍♂️ This proposal has been submitted for review."
        case ProposalStatus.APPROVED:
            return "👍 This proposal has been approved and is waiting for voting."
        case ProposalStatus.VOTING:
            return "⌛ This proposal is currently being voted on."
        case ProposalStatus.IN_PROGRESS:
            return "🎉 This proposal is currently in progress."
        case ProposalStatus.FAILED:
            return "❌ This proposal has failed and is no longer active."
        case ProposalStatus.FAILED_DRAFT:
            return "👨‍💻 This draft proposal has failed and is waiting for the author to update it and resubmit."
        case ProposalStatus.CANCELLED:
            return "⛔ This proposal has been cancelled."
        case _:
            return "👍 This proposal has been completed."


def get_args(message: Message) -> str:
    try:
        return message.text.split(" ", 1)[1].strip()
    except IndexError:
        return ""
