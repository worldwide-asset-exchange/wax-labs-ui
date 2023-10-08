from fastapi import APIRouter

router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


@router.patch("/status/{proposal_id}")
async def refresh_status_proposal(proposal_id: str):
    return proposal_id


@router.post("/subscribe_to")
async def subscribe_to_proposal(proposal_id: str):
    return proposal_id

@router.post("/unsubscribe_to")
async def subscribe_to_proposal(proposal_id: str):
    return proposal_id
