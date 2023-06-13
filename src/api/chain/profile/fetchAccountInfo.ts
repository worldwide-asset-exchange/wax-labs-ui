import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export async function fetchAccountInfo({ accountName }: { accountName: string }): Promise<number | null> {
  try {
    const { rows } = (await wax.rpc.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: accountName,
      table: Tables.ACCOUNTS,
      json: true,
      limit: 1,
    })) as GetTableRowsResult<{ balance: string | null }>;

    if (rows.length) {
      return currencyToFloat(rows?.[0]?.balance);
    }
  } catch (e) {
    console.error('fetchAccountInfo error', e);
  }

  return null;
}
