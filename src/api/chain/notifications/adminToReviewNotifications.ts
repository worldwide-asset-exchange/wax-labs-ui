import { getProposals } from '@/api/chain/proposals/query/getProposals.ts';
import { statBounds } from '@/api/chain/proposals/query/proposalBounds.ts';
import { WaxLabsNotification } from '@/api/models/notifications.ts';
import { NotificationType, ProposalFilterType, ProposalStatusKey } from '@/constants.ts';

export default async function adminToReviewNotifications(): Promise<WaxLabsNotification[]> {
  try {
    const { upperBound, lowerBound } = statBounds(ProposalStatusKey.SUBMITTED_OR_DELIVERABLE_IN_PROGRESS);

    const proposals = await getProposals({
      queryType: ProposalFilterType.BY_STAT_CAT,
      upperBound,
      lowerBound,
    });

    return proposals.map(
      p =>
        ({
          notificationType: NotificationType.REVIEW_PENDING,
          readNotificationKey: `${NotificationType.REVIEW_PENDING}-${p.proposal_id}`,
          id: p.proposal_id,
          title: p.title,
          summary: p.description,
          status: p.status,
        } as WaxLabsNotification)
    );
  } catch (e) {
    console.error('[adminToReviewNotifications] Error', e);

    return [];
  }
}
