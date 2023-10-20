import { Action, SessionProps } from '@/api/models';
import { GenericProposalWithMemo } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSkipVotingAction extends SessionProps {
  proposalId: number;
  memo?: string;
}

export default function createSkipVotingAction({
  session,
  proposalId,
  memo,
}: CreateSkipVotingAction): Action<GenericProposalWithMemo> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SKIP_VOTING,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      memo: memo ?? '',
      proposal_id: proposalId,
    },
  };
}
