import wax from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { ProposalComment } from '@/api/models/proposal.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function proposalStatusComment({ proposalId }: { proposalId: number }): Promise<ProposalComment | null> {
  for (;;) {
    try {
      const { rows } = (await wax.rpc.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.PROPOSAL_COMMENTS,
        json: true,
        lower_bound: proposalId,
        upper_bound: proposalId,
      })) as GetTableRowsResult<ProposalComment>;

      return rows?.[0];
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
