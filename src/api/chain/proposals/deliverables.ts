import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Deliverables } from '@/api/models/deliverables.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function deliverables({ proposalId }: { proposalId: string }): Promise<{ deliverables: Deliverables[] }> {
  for (;;) {
    try {
      const { rows } = (await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: proposalId,
        table: Tables.DELIVERABLES,
        json: true,
        limit: 1000,
      })) as GetTableRowsResult<Deliverables>;

      return { deliverables: rows };
    } catch (e) {
      console.error('Error while getting deliverables', e);
    }
  }
}
