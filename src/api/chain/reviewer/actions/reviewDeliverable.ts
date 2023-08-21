import { execute } from '@/api/chain/actions';
import createReviewDeliverableAction, {
  CreateReviewDeliverableAction,
} from '@/api/chain/reviewer/actions/create/createReviewDeliverableAction.ts';

export async function reviewDeliverable({
  proposalId,
  deliverableId,
  accept,
  memo,
  session,
}: CreateReviewDeliverableAction) {
  return await execute(session, [createReviewDeliverableAction({ proposalId, accept, deliverableId, memo, session })]);
}
