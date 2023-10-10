from pydantic import UUID4, TypeAdapter
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from notifications.core.services.base_service import BaseService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.models.account import User
from notifications.models.proposals import Subscription
from notifications.schemas.subscription import BotSubscription, SubscriptionExport
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


class SubscriptionService(BaseService[Subscription, SubscriptionExport], ISubscriptionService):
    table = Subscription
    table_export = SubscriptionExport

    async def create_from_wax_proposal(self, wax_proposal: WaxProposal, user_uuid: UUID4) -> None:
        await self.subscribe_to_proposal(proposal_id=wax_proposal.proposal_id, user_uuid=user_uuid)

    async def subscribe_to_proposal(self, proposal_id: int, user_uuid: UUID4) -> None:
        try:
            await self.get_raw_by((self.table.proposal_id == proposal_id) & (self.table.user_id == user_uuid))
        except NoResultFound:
            await self.create(
                data={
                    self.table.proposal_id: proposal_id,
                    self.table.user_id: user_uuid,
                },
                return_raw=True,
            )

    async def subscription_exists(self, proposal_id: int, user_uuid: UUID4) -> bool:
        return await self.record_exists((self.table.proposal_id == proposal_id) & (self.table.user_id == user_uuid))

    async def unsubscribe(self, proposal_id: int, user_uuid: UUID4) -> None:
        try:
            subscription = await self.get_raw_by(
                (self.table.proposal_id == proposal_id) & (self.table.user_id == user_uuid)
            )

            await self.delete(uuid=subscription.uuid)
        except NoResultFound:
            pass

    async def subscriptions(self, proposal_id: int) -> list[BotSubscription]:
        async_session: AsyncSession

        adapter = TypeAdapter(list[BotSubscription])

        async with self._database.session() as async_session:
            stmt = (
                select(self.table.proposal_id, User.chat_id)
                .join(User)
                .where(self.table.proposal_id == proposal_id)
                .where(User.chat_id.is_not(None))
            )

            result = await async_session.execute(stmt)
            all_rows = result.all()

            return adapter.validate_python(all_rows, from_attributes=True)
