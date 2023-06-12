import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function inVotingProposals() {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.VOTING);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    statusKey: ProposalStatusKey.VOTING,
    lowerBound,
    upperBound,
  });
}
