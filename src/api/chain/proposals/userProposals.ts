import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function userProposals({
  proposalStatusKey,
  accountName,
}: {
  proposalStatusKey: ProposalStatusKey;
  accountName: string;
}): Promise<Proposal[]> {
  const { upperBound, lowerBound } = nameBounds(proposalStatusKey, accountName);

  return getProposals({
    queryType: ProposalFilterType.BY_PROPOSER_STAT,
    lowerBound,
    upperBound,
  });
}
