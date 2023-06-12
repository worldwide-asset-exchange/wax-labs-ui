import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function submittedProposals() {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.SUBMITTED);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    statusKey: ProposalStatusKey.SUBMITTED,
    lowerBound,
    upperBound,
  });
}
