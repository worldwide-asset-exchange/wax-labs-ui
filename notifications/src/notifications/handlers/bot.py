from fastapi import APIRouter

router = APIRouter(
    prefix="/bot",
    tags=["Bot"],
)


@router.patch("/")
async def refresh_status_proposal(proposal_id: str):
    return proposal_id


@router.post("/subscribe_to")
async def subscribe_to_proposal(proposal_id: str):
    return proposal_id


@router.post("/unsubscribe_to")
async def unsubscribe_to_proposal(proposal_id: str):
    return proposal_id
