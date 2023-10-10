import typing

from notifications.settings import Tables, cfg
from notifications.wax_interface.chain import get_table_rows
from notifications.wax_interface.queries import WaxObjectNotFound
from notifications.wax_interface.schemas.wax_proposal import WaxProposal


async def get_proposal(proposal_id: int) -> WaxProposal | None:
    async for row in get_table_rows(
        code=cfg.wax_labs_contract_account,
        scope=cfg.wax_labs_contract_account,
        table=Tables.PROPOSALS,
        lower_bound=proposal_id,
        upper_bound=proposal_id,
        limit=1,
    ):
        if row:
            return WaxProposal.model_validate(row)

    raise WaxObjectNotFound()


async def get_proposals() -> typing.AsyncGenerator[WaxProposal, None]:
    async for row in get_table_rows(
        code=cfg.wax_labs_contract_account,
        scope=cfg.wax_labs_contract_account,
        table=Tables.PROPOSALS,
        full=True,
    ):
        yield WaxProposal.model_validate(row)
