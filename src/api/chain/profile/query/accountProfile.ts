import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Profile } from '@/api/models/profile.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function accountProfile(profile: string) {
  try {
    const { rows } = (await wax.rpc.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: LABS_CONTRACT_ACCOUNT,
      table: Tables.PROFILES,
      json: true,
      lower_bound: profile,
      upper_bound: profile,
      limit: 1,
    })) as GetTableRowsResult<{ profile?: Profile }>;

    return rows?.[0]?.profile as Profile;
  } catch (e) {
    console.error('[accountProfile] Error', e);
    return null;
  }
}
