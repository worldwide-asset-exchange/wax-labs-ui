import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export default async function adminEndVotingNotifications(): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = statBounds(ProposalStatusKey.VOTING);

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_STAT_CAT,
      upperBound,
      lowerBound,
    });

    const now = new Date();
    return proposals
      .filter(p => new Date(p.vote_end_time) < now)
      .map(
        p =>
          ({
            notificationType: NotificationType.ADMIN_PROPOSAL_END_VOTING,
            readNotificationKey: `${NotificationType.ADMIN_PROPOSAL_END_VOTING}-${p.proposal_id}`,
            id: p.proposal_id,
            title: p.title,
            summary: p.description,
            status: p.status,
          } as WaxLabsNotification)
      );
  } catch (e) {
    console.error('[adminEndVotingNotifications] Error', e);

    return [];
  }
}
