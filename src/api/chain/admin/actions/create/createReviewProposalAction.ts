import { Action, SessionProps } from '@/api/models';
import { ReviewProposal } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateReviewProposalAction extends SessionProps {
  proposalId: number;
  approve: boolean;
  draft: boolean;
  memo: string;
}

export default function createReviewProposalAction({
  session,
  proposalId,
  approve,
  draft,
  memo,
}: CreateReviewProposalAction): Action<ReviewProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REVIEW_PROPOSAL,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      approve,
      draft,
      memo,
    },
  };
}
