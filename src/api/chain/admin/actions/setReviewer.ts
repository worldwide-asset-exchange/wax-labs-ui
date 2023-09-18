import { execute } from '@/api/chain/actions';
import createSetReviewerAction, {
  CreateSetReviewerAction,
} from '@/api/chain/admin/actions/create/createSetReviewerAction.ts';

export async function setReviewer({ newReviewer, proposalId, session }: CreateSetReviewerAction) {
  return await execute(session, [createSetReviewerAction({ newReviewer, proposalId, session })]);
}
