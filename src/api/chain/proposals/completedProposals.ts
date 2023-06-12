import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function completedProposals() {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.COMPLETED);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    statusKey: ProposalStatusKey.COMPLETED,
    lowerBound,
    upperBound,
  });
}
