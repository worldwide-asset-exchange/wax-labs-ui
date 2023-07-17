import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { nameBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export default async function proposerEndVotingNotifications({
  accountName,
}: {
  accountName: string;
}): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = nameBounds({ statusKey: ProposalStatusKey.VOTING, accountName });

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_PROPOSER_STAT,
      upperBound,
      lowerBound,
    });

    const now = new Date();
    return proposals
      .filter(p => new Date(p.vote_end_time) < now)
      .map(
        p =>
          ({
            notificationType: NotificationType.PROPOSAL_END_VOTING,
            readNotificationKey: `${NotificationType.PROPOSAL_END_VOTING}-${p.proposal_id}`,
            id: p.proposal_id,
            title: p.title,
            summary: p.description,
            status: p.status,
          } as WaxLabsNotification)
      );
  } catch (e) {
    console.error('[proposerEndVotingNotifications] Error', e);

    return [];
  }
}
