import asyncio
import contextlib
import logging

import asyncpg_listen
from aiogram import Bot
from aiogram.enums import ParseMode
from asyncpg_listen import Notification
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from notifications.bot.utils import proposal_status_to_message
from notifications.core.repository import IDatabase
from notifications.interfaces.proposal_service import IProposalService
from notifications.interfaces.subscription_service import ISubscriptionService
from notifications.wax_interface.queries.proposals import get_proposal


class NotificationHandler:
    def __init__(
        self,
        database: IDatabase,
        subscription_service: ISubscriptionService,
        proposal_service: IProposalService,
        bot: Bot,
    ):
        self.database = database
        self.listener_task = None
        self.listener_task: asyncio.Task | None = None
        self.subscription_service = subscription_service
        self.proposal_service = proposal_service
        self._bot = bot
        self._logger = logging.getLogger("waxlabs")

    async def notify(self, proposal_id: int):
        session: AsyncSession

        async with self.database.session() as session:
            await session.execute(text(f"NOTIFY proposal, '{proposal_id}'"))

    async def connect(self):
        return lambda: self.database.engine.connect()

    async def handler(self, notification: asyncpg_listen.NotificationOrTimeout) -> None:
        if isinstance(notification, Notification):
            print(f"{notification} has been received {notification.payload}")

            subscriptions = []

            try:
                proposal_id = int(notification.payload)
                wax_proposal = await get_proposal(proposal_id)
                proposal = await self.proposal_service.get_by_proposal_id(proposal_id)

                if proposal.status != wax_proposal.status:
                    await self.proposal_service.update_status(wax_proposal)

                    subscriptions = await self.subscription_service.subscriptions(proposal_id)

            except ValueError as ex:
                self._logger.error("Handling notification, raised ValueError", exc_info=ex)
            else:
                for subscription in subscriptions:
                    try:
                        await self._bot.send_message(
                            chat_id=subscription.chat_id,
                            text=proposal_status_to_message(wax_proposal.proposal_id, wax_proposal.status),
                            parse_mode=ParseMode.MARKDOWN,
                        )
                    except Exception as ex:
                        self._logger.error("Sending bot notification, raised Exception", exc_info=ex)

    def listen(self):
        listener = asyncpg_listen.NotificationListener(
            asyncpg_listen.connect_func(
                dsn=self.database.connection_string(override_driver="postgresql"),
            )
        )
        self.listener_task = asyncio.create_task(
            listener.run(
                {"proposal": self.handler},
                policy=asyncpg_listen.ListenPolicy.ALL,
                notification_timeout=5,
            )
        )

    async def stop(self):
        with contextlib.suppress(asyncio.CancelledError):
            if self.listener_task:
                self.listener_task.cancel()
                await self.listener_task
