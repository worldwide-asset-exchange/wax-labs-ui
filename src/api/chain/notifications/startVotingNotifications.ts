import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export default async function startVotingNotifications({ actor }: { actor: string }): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = nameBounds({
      statusKey: ProposalStatusKey.APPROVED,
      actor,
    });

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_PROPOSER_STAT,
      upperBound,
      lowerBound,
    });

    return proposals.map(
      p =>
        ({
          notificationType: NotificationType.START_VOTING,
          readNotificationKey: `${NotificationType.START_VOTING}-${p.proposal_id}`,
          id: p.proposal_id,
          title: p.title,
          summary: p.description,
          status: p.status,
        } as WaxLabsNotification)
    );
  } catch (e) {
    console.error('[startVotingNotifications] Error', e);

    return [];
  }
}
