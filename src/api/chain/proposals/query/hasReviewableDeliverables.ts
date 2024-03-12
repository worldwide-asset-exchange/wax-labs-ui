import { UInt64 } from '@wharfkit/antelope';

import { waxClient } from '@/api/chain';
import { GetTableRowsResult } from '@/api/models';
import { Deliverables } from '@/api/models/deliverables.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { DeliverableStatusKey, LABS_CONTRACT_ACCOUNT, NEVER_REVIEWED_DATE, Tables } from '@/constants.ts';

export async function hasReviewableDeliverables(proposals: Proposal[]): Promise<Proposal[]> {
  if (!proposals.length) {
    return [];
  }

  const status = await Promise.all(proposals.map(p => deliverableIsReviewable(p.proposal_id)));

  const proposalIds = status.flat().filter(Boolean) as number[];

  return proposals.filter(p => proposalIds.includes(p.proposal_id));
}

async function deliverableIsReviewable(proposalId: number): Promise<number | null> {
  try {
    const { rows } = (await waxClient.v1.chain.get_table_rows({
      code: LABS_CONTRACT_ACCOUNT,
      scope: UInt64.from(proposalId),
      table: Tables.DELIVERABLES,
      json: true,
      limit: 1000,
    })) as GetTableRowsResult<Deliverables>;

    const found = rows.find(d => d.status === DeliverableStatusKey.REPORTED && d.review_time === NEVER_REVIEWED_DATE);

    return found ? proposalId : null;
  } catch (e) {
    console.error('[deliverableIsReviewable]', e);

    return null;
  }
}
