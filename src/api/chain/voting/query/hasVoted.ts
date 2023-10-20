import { Name } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { DECIDE_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function hasVoted({ actor }: { actor: string }): Promise<boolean> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: DECIDE_CONTRACT_ACCOUNT,
      scope: Name.from(actor),
      table: Tables.VOTERS,
      json: true,
      limit: 1,
    })) as GetTableRowsResult<{ liquid: string }>;

    return rows.length > 0;
  } catch (e) {
    console.error('[hasVoted] Error', e);
  }

  return false;
}
