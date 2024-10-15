import { UInt64 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Deliverables } from '@/api/models/deliverables.ts';
import { DeliverableStatusKey, LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function deliverablesWithStatus({
  proposalId,
  deliverableStatusKey,
}: {
  proposalId: number;
  deliverableStatusKey: DeliverableStatusKey;
}): Promise<(Deliverables & { proposalId: number })[]> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: UInt64.from(proposalId),
      table: Tables.DELIVERABLES,
      json: true,
      limit: 1000,
    })) as GetTableRowsResult<Deliverables>;

    return rows.filter(d => d.status === deliverableStatusKey).map(d => ({ ...d, proposalId }));
  } catch (e) {
    console.error('[deliverablesWithStatus]', e);
  }

  return [];
}
