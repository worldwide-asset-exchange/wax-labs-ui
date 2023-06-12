import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function inProgressProposals() {
  const { upperBound, lowerBound } = statBounds(ProposalStatusKey.PROPOSAL_IN_PROGRESS);

  return getProposals({
    queryType: ProposalFilterType.BY_STAT_CAT,
    statusKey: ProposalStatusKey.PROPOSAL_IN_PROGRESS,
    lowerBound,
    upperBound,
  });
}
