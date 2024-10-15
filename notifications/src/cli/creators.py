from pydantic import UUID4
from rich.console import Console

from notifications.container import container
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.interfaces.user_service import IUserService
from notifications.wax_interface.queries.profile import get_profiles
from notifications.wax_interface.queries.proposals import get_proposals

console = Console()


async def create_users_from_profile():
    user_service = container[IUserService]

    async for profile in get_profiles():
        await user_service.create_from_wax_profile(profile)

        console.log(f"Created user {profile.wax_account}")


async def create_proposals_from_wax_proposals():
    proposal_service = container[IProposalService]
    subscription_service = container[ISubscriptionService]
    user_service = container[IUserService]

    all_users = await user_service.all(user_service.table.deleted_at.is_(None))
    all_users_mapping: dict[UUID4, user_service.table_export] = {user.wax_account: user.uuid for user in all_users}

    async for proposal in get_proposals():
        await proposal_service.create_from_wax_proposal(proposal)

        if user_id := all_users_mapping.get(proposal.proposer):
            await subscription_service.create_from_wax_proposal(proposal, user_id)

        console.log(f"Created proposal {proposal.proposal_id}")
