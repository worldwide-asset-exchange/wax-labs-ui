import { Name } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Profile } from '@/api/models/profile.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function accountProfile(profile: string) {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: LABS_CONTRACT_ACCOUNT,
      table: Tables.PROFILES,
      json: true,
      lower_bound: Name.from(profile),
      upper_bound: Name.from(profile),
      limit: 1,
    })) as GetTableRowsResult<Profile>;

    return rows?.[0];
  } catch (e) {
    console.error('[accountProfile] Error', e);
    return null;
  }
}
