import { WaxUser } from '@eosdacio/ual-wax';

import wax from '@/api/chain';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';
import { toFloat } from '@/utils/parser.ts';

export async function fetchAccountInfo({ activeUser }: { activeUser: WaxUser }): Promise<number | null> {
  try {
    const resp = await wax.rpc.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: activeUser.accountName,
      table: Tables.ACCOUNTS,
      json: true,
      limit: 1,
    });

    if (resp.rows.length) {
      return toFloat(resp.rows[0].balance);
    }
  } catch (e) {
    console.error('getAccountInfo error', e);
  }

  return null;
}
