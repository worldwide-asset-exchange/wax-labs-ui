import { getProposals } from '@/api/chain/proposals/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/proposalBounds.ts';
import { ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export function userProposals({
  proposalStatusKey,
  accountName,
}: {
  proposalStatusKey: ProposalStatusKey;
  accountName: string;
}) {
  const { upperBound, lowerBound } = nameBounds(proposalStatusKey, accountName);

  return getProposals({
    queryType: ProposalFilterType.BY_PROPOSER_STAT,
    statusKey: proposalStatusKey,
    lowerBound,
    upperBound,
  });
}
