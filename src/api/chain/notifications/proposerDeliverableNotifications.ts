import { checkDeliverablesStatus } from '@/api/chain/deliverables/query/checkDeliverablesStatus.ts';
import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { DeliverablesStatusToCheck } from '@/api/models/common.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

const statusToCheck: DeliverablesStatusToCheck[] = [
  {
    notificationType: NotificationType.CLAIM_DELIVERABLE,
    proposalStatusKey: ProposalStatusKey.VOTING_OR_ACCEPTED,
  },
  {
    notificationType: NotificationType.REJECTED_DELIVERABLE,
    proposalStatusKey: ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS,
  },
];

export default async function proposerDeliverableNotifications({
  accountName,
}: {
  accountName: string;
}): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = nameBounds({
      statusKey: ProposalStatusKey.REJECTED_OR_PROPOSAL_IN_PROGRESS,
      accountName,
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
    console.error('[proposerDeliverableNotifications] Error', e);

    return [];
  }
}
