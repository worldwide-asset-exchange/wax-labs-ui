import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { ProposalContent } from '@/api/models/proposal.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function proposalContentData({ proposalId }: { proposalId: number }): Promise<ProposalContent | null> {
  for (;;) {
    try {
      const { rows } = (await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.MD_BODIES,
        json: true,
        lower_bound: proposalId,
        upper_bound: proposalId,
      })) as GetTableRowsResult<ProposalContent>;

      return rows?.[0];
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
