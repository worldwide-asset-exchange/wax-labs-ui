import wax from '@/api/chain';
import {
  DELPHIORACLE_CONTRACT_ACCOUNT,
  DELPHIORACLE_DATAPOINTS_TABLE,
  DELPHIORACLE_KEY_TYPE,
  DELPHIORACLE_WAXPUSD_PAIR,
} from '@/constants.ts';

export async function fetchWAXMedianUSDPrice(): Promise<number | null> {
  const resp = await wax.rpc.get_table_rows({
    limit: 1,
    code: DELPHIORACLE_CONTRACT_ACCOUNT,
    scope: DELPHIORACLE_WAXPUSD_PAIR,
    table: DELPHIORACLE_DATAPOINTS_TABLE,
    json: true,
    index_position: 3,
    key_type: DELPHIORACLE_KEY_TYPE,
    reverse: true,
  });

  return resp?.rows?.[0]?.median;
}
