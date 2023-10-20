import { UInt64 } from '@wharfkit/antelope';

import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { Proposal } from '@/api/models/proposal.ts';

export async function singleProposal({ proposalId }: { proposalId: number }): Promise<Proposal | null> {
  try {
    const proposals = await getProposals({
      lowerBound: UInt64.from(proposalId),
      upperBound: UInt64.from(proposalId),
    });

    return proposals?.[0] ?? null;
  } catch {
    return null;
  }
}
