import { Name } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export async function accountBalance({ actor }: { actor: string }): Promise<number> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: Name.from(actor),
      table: Tables.ACCOUNTS,
      json: true,
      limit: 1,
    })) as GetTableRowsResult<{ balance: string | null }>;

    if (rows.length) {
      return currencyToFloat(rows?.[0]?.balance) ?? 0;
    }
  } catch (e) {
    console.error('[accountBalance] Error', e);
  }

  return 0;
}
