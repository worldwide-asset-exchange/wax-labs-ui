import { UInt64 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { ProposalComment } from '@/api/models/proposal.ts';
import { LABS_CONTRACT_ACCOUNT, Tables } from '@/constants.ts';

export async function proposalStatusComment({ proposalId }: { proposalId: number }): Promise<ProposalComment | null> {
  for (;;) {
    try {
      const { rows } = (await waxClient.v1.chain.get_table_rows({
        code: LABS_CONTRACT_ACCOUNT,
        scope: LABS_CONTRACT_ACCOUNT,
        table: Tables.PROPOSAL_COMMENTS,
        json: true,
        lower_bound: UInt64.from(proposalId),
        upper_bound: UInt64.from(proposalId),
      })) as GetTableRowsResult<ProposalComment>;

      return rows?.[0];
    } catch (e) {
      console.error('[proposalContentData] Error', e);
    }
  }
}
