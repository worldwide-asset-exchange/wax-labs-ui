import wax from '@/api/chain';
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
      const { rows } = (await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.DELIVERABLES_COMMENTS,
        json: true,
        lower_bound: deliverableId,
        upper_bound: deliverableId,
      })) as GetTableRowsResult<DeliverableComment>;

      return rows?.[0];
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
