import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { Proposal } from '@/api/models/proposal.ts';

export async function singleProposal({ proposalId }: { proposalId: number }): Promise<Proposal> {
  const proposals = await getProposals({
    lowerBound: proposalId,
    upperBound: proposalId,
  });

  return proposals?.[0];
}
