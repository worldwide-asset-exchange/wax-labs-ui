import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { EOSIO_TOKEN_CODE, SAVINGS_ACCOUNT, Tables } from '@/constants.ts';

interface SavingsAccountResponse {
  balance: string;
}

export async function savingsData(): Promise<SavingsAccountResponse> {
  const { rows } = (await wax.rpc.get_table_rows({
    json: true,
    code: EOSIO_TOKEN_CODE,
    scope: SAVINGS_ACCOUNT,
    table: Tables.ACCOUNTS,
  })) as GetTableRowsResult<SavingsAccountResponse>;

  return rows?.[0] ?? ({ balance: '0 WAX' } as SavingsAccountResponse);
}
