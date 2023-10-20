import { execute } from '@/api/chain/actions';
import createReviewProposalAction, {
  CreateReviewProposalAction,
} from '@/api/chain/reviewer/actions/create/createReviewProposalAction.ts';

export async function reviewProposal({ proposalId, approve, draft, memo, session }: CreateReviewProposalAction) {
  return await execute(session, [createReviewProposalAction({ proposalId, approve, draft, memo, session })]);
}
