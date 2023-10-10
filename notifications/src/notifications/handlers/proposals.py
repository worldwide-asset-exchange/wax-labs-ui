from fastapi import APIRouter

from notifications.container import container
from notifications.core.schemas.common import Message
from notifications.services.listener import NotificationHandler

router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


@router.patch("/status/{proposal_id}", response_model=Message, status_code=200)
async def refresh_status_proposal(proposal_id: int):
    notification_handler = container[NotificationHandler]

    await notification_handler.notify(proposal_id)

    return Message.create("Proposal status has been refreshed")
