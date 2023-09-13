import typing

import httpx
from loguru import logger

from notifications.notification_bot.models import Proposal
from notifications.notification_bot.proposal import to_proposal_status
from notifications.settings import Tables, cfg


async def _get_table_rows(
    code: str,
    table: str,
    scope: str,
    index_position: str | None = None,
    key_type: str | None = None,
    encode_type: str | None = None,
    lower_bound: str | int | None = None,
    upper_bound: str | int | None = None,
    limit: int = 1000,
    reverse: int | None = None,
    show_payer: int | None = None,
    full: bool = False,
) -> list[dict[str, typing.Any]]:
    """
    Return a list with the rows in the table.

    Similar to get_table_rows
    https://developers.eos.io/manuals/eos/latest/nodeos/plugins/chain_api_plugin/api-reference/index#operation/get_table_rows

    Parameters:
    -----------
    full: bool = True
        Get the full table.
        Requires multiple requests to be made.
        The maximum number of requests made is 1000.
    """
    endpoint = "/v1/chain/get_table_rows"

    payload = dict(
        code=code,
        table=table,
        scope=scope,
        json=True,
        index_position=index_position,
        key_type=key_type,
        encode_type=encode_type,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        limit=limit,
        reverse=reverse,
        show_payer=show_payer,
    )
    payload = {k: v for k, v in payload.items() if v is not None}

    async with httpx.AsyncClient(base_url=str(cfg.wax_chain_url)) as client:
        rows = []
        for _ in range(1000):
            logger.debug(f"Get data with {lower_bound=}")
            response = await client.post(url=endpoint, json=payload)

            if response.status_code != 200:
                response.raise_for_status()

            data = response.json()

            if "rows" not in data:
                return data

            rows += data["rows"]

            if not full or not data.get("more"):
                break

            lower_bound = data["next_key"]
            payload["lower_bound"] = lower_bound
        else:
            raise ValueError("Too many requests (>1000) for table")

        return rows


async def get_proposal(proposal_id: int) -> Proposal | None:
    rows = await _get_table_rows(
        code=cfg.wax_labs_contract_account,
        scope=cfg.wax_labs_contract_account,
        table=Tables.PROPOSALS.value,
        lower_bound=proposal_id,
        upper_bound=proposal_id,
        limit=1,
    )

    return Proposal(**rows[0]) if rows else None


async def get_proposal_status(proposal_id) -> str:
    proposal = await get_proposal(proposal_id)

    return to_proposal_status(proposal.status).value.upper()
