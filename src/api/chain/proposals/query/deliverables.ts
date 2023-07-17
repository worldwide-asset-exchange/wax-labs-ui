import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Currency } from '@/api/models/common.ts';
import { Deliverables } from '@/api/models/deliverables.ts';
import { LABS_CONTRACT_ACCOUNT, ProposalStatusKey, Tables } from '@/constants.ts';
import { currencyToFloat } from '@/utils/parser.ts';

export async function deliverables({
  proposalId,
  statuses,
}: {
  proposalId: number;
  statuses?: ProposalStatusKey[];
}): Promise<{ deliverables: Deliverables[] }> {
  for (;;) {
    try {
      let { rows } = (await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: proposalId,
        table: Tables.DELIVERABLES,
        json: true,
        limit: 1000,
      })) as GetTableRowsResult<Deliverables>;

      if (statuses) {
        rows = rows.filter(d => statuses.includes(d.status));
      }

      return {
        deliverables: rows.map(d => {
          d.requested_amount = currencyToFloat(d.requested) as number | undefined;
          d.currency = (d.requested.split(' ')[1] || 'WAX') as Currency;
          return d;
        }),
      };
    } catch (e) {
      console.error('[deliverables] Error', e);
    }
  }
}
