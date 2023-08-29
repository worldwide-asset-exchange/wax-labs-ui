import { Name } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { BallotOptions } from '@/api/models/voting.ts';
import { DECIDE_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function ballotOptions({ ballotName }: { ballotName: string }): Promise<boolean> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: DECIDE_CONTRACT_ACCOUNT,
      scope: DECIDE_CONTRACT_ACCOUNT,
      table: Tables.BALLOTS,
      json: true,
      lower_bound: Name.from(ballotName),
      upper_bound: Name.from(ballotName),
      limit: 1,
    })) as GetTableRowsResult<{ options: BallotOptions[] }>;

    return rows.length > 0;
  } catch (e) {
    console.error('[ballotOptions] Error', e);
  }

  return false;
}