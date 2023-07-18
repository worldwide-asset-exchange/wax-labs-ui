import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function inProgressProposals(): Promise<Proposal[]> {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    lowerBound,
    upperBound,
  });
}
