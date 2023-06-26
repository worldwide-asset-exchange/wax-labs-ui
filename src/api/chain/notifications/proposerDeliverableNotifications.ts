import { checkDeliverablesStatus } from '@/api/chain/deliverables/query/checkDeliverablesStatus.ts';
import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { DeliverablesStatusToCheck } from '@/api/models/common.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

const statusToCheck: DeliverablesStatusToCheck[] = [
  {
    notificationType: NotificationType.CLAIM_DELIVERABLE,
    proposalStatusKey: ProposalStatusKey.ACCEPTED,
  },
  {
    notificationType: NotificationType.REJECTED_DELIVERABLE,
    proposalStatusKey: ProposalStatusKey.REJECTED,
  },
];

export default async function proposerDeliverableNotifications({
  accountName,
}: {
  accountName: string;
}): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = nameBounds({ statusKey: ProposalStatusKey.PROPOSAL_IN_PROGRESS, accountName });

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_PROPOSER_STAT,
      upperBound,
      lowerBound,
    });

    return await Promise.all(
      proposals.map(p => checkDeliverablesStatus({ proposalId: p.proposal_id, statusToCheck }))
    ).then(r => {
      return r.flat().map(p => ({
        notificationType: p.notificationType,
        readNotificationKey: `${p.notificationType}-${p.proposalId}-${p.deliverableId}`,
        id: p.proposalId,
      }));
    });
  } catch (e) {
    console.error('[proposerDeliverableNotifications] Error', e);

    return [];
  }
}
