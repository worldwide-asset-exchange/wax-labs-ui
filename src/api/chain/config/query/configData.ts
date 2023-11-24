import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Config } from '@/api/models/config.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export interface ConfigData extends Config {
  additional_funds: number | null;
  display_additional_funds: string;
  display_available_funds: number | null;
}

export async function configData(): Promise<Config | null> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: LABS_CONTRACT_ACCOUNT,
      table: Tables.CONFIG,
      json: true,
      limit: 1,
    })) as GetTableRowsResult<Config>;

    return rows?.[0] ?? null;
  } catch (e) {
    console.error('[configData] Error', e);
  }

  return null;
}
