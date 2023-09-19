import { Action, SessionProps } from '@/api/models';
import { NewReviewer } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetReviewerAction extends SessionProps {
  proposalId: number;
  newReviewer: string;
}

export default function createSetReviewerAction({
  session,
  newReviewer,
  proposalId,
}: CreateSetReviewerAction): Action<NewReviewer> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_REVIEWER,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_reviewer: newReviewer,
      proposal_id: proposalId,
      deliverable_id: 1,
    },
  };
}
