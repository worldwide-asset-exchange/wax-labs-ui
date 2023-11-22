import { Action, SessionProps } from '@/api/models';
import { ReviewDeliverable } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateReviewDeliverableAction extends SessionProps {
  proposalId: number;
  deliverableId: number;
  accept: boolean;
  review: string;
}

export default function createReviewDeliverableAction({
  session,
  proposalId,
  accept,
  deliverableId,
  review,
}: CreateReviewDeliverableAction): Action<ReviewDeliverable> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REVIEW_DELIVERABLE,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      deliverable_id: deliverableId,
      accept,
      memo: review,
    },
  };
}
