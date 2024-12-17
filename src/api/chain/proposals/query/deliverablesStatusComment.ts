import { UInt64 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { DeliverableComment } from '@/api/models/proposal.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function deliverablesStatusComment({ proposalId }: { proposalId: number }): Promise<DeliverableComment[]> {
  for (;;) {
    try {
      const { rows } = (await waxClient.v1.chain.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: UInt64.from(proposalId),
        table: Tables.DELIVERABLES_COMMENTS,
        json: true,
      })) as GetTableRowsResult<DeliverableComment>;

      return rows ?? [];
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
