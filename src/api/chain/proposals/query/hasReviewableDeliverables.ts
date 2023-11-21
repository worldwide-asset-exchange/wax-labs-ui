import { checkDeliverablesStatus } from '@/api/chain/deliverables/query/checkDeliverablesStatus.ts';
import { DeliverablesStatusToCheck } from '@/api/models/common.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { DeliverableStatusKey, NotificationType } from '@/constants.ts';

const statusToCheck: DeliverablesStatusToCheck[] = [
  {
    notificationType: NotificationType.CLAIM_DELIVERABLE,
    deliverableStatusKey: DeliverableStatusKey.REPORTED,
  },
];

export async function hasReviewableDeliverables(proposals: Proposal[]): Promise<Proposal[]> {
  const status = await Promise.all(
    proposals.map(p => checkDeliverablesStatus({ proposalId: p.proposal_id, statusToCheck }))
  );

  console.log(status);
  console.log(proposals);

  const proposalIds = status.flat().map(d => d.proposalId);

  console.log(proposalIds);

  return proposals.filter(p => proposalIds.includes(p.proposal_id));
}
