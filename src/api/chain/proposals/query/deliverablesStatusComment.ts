import { UInt32 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { DeliverableComment } from '@/api/models/proposal.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function deliverablesStatusComment({
  deliverableId,
}: {
  deliverableId: number;
}): Promise<DeliverableComment | null> {
  for (;;) {
    try {
      const { rows } = (await waxClient.v1.chain.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.DELIVERABLES_COMMENTS,
        json: true,
        lower_bound: UInt32.from(deliverableId),
        upper_bound: UInt32.from(deliverableId),
      })) as GetTableRowsResult<DeliverableComment>;

      return rows?.[0] ?? null;
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
