import typing

from notifications.settings import Tables, cfg
from notifications.wax_interface.chain import get_table_rows
from notifications.wax_interface.schemas.profile import Profile


async def get_profile(proposal_id: int) -> Profile | None:
    async for row in get_table_rows(
        code=cfg.wax_labs_contract_account,
        scope=cfg.wax_labs_contract_account,
        table=Tables.PROFILES,
        lower_bound=proposal_id,
        upper_bound=proposal_id,
        full=True,
    ):
        return Profile(**row)

    return None


async def get_profiles() -> typing.AsyncGenerator[Profile, None]:
    async for row in get_table_rows(
        code=cfg.wax_labs_contract_account,
        scope=cfg.wax_labs_contract_account,
        table=Tables.PROFILES,
        full=True,
    ):
        yield Profile(**row)
