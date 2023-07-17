import { Action, SessionProps } from '@/api/models';
import { BeginAndEndVote } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateEndVotingAction extends SessionProps {
  proposalId: number;
  ballotName: string;
}

export default function createEndVotingAction({
  session,
  proposalId,
  ballotName,
}: CreateEndVotingAction): Action<BeginAndEndVote> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.END_VOTING,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
      ballot_name: ballotName,
    },
  };
}
