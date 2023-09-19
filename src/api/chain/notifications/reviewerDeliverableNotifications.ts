import { checkDeliverablesStatus } from '@/api/chain/deliverables/query/checkDeliverablesStatus.ts';
import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { DeliverablesStatusToCheck } from '@/api/models/common.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { DeliverableStatusKey, NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

const statusToCheck: DeliverablesStatusToCheck[] = [
  {
    notificationType: NotificationType.DELIVERABLES_TO_REVIEW,
    deliverableStatusKey: DeliverableStatusKey.REPORTED,
  },
];

export default async function reviewerDeliverableNotifications({
  actor,
}: {
  actor: string;
}): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = nameBounds({
      statusKey: ProposalStatusKey.IN_PROGRESS,
      actor,
    });

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_PROPOSER_STAT,
      upperBound,
      lowerBound,
    });

    const proposalMapping = proposals.reduce((previousProposal, proposal) => {
      previousProposal[proposal.proposal_id] = proposal;

      return previousProposal;
    }, {} as Record<number, Proposal>);

    return await Promise.all(
      proposals.map(p => checkDeliverablesStatus({ proposalId: p.proposal_id, statusToCheck }))
    ).then(r => {
      return r.flat().map(
        d =>
          ({
            notificationType: d.notificationType,
            readNotificationKey: `${d.notificationType}-${d.proposalId}-${d.deliverableId}`,
            id: d.proposalId,
            title: proposalMapping[d.proposalId]?.title,
            summary: proposalMapping[d.proposalId]?.description,
            status: proposalMapping[d.proposalId]?.status,
          } as WaxLabsNotification)
      );
    });
  } catch (e) {
    console.error('[reviewerDeliverableNotifications] Error', e);

    return [];
  }
}
