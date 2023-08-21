import { Action, SessionProps } from '@/api/models';
import { BeginVoting } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateBeginVotingAction extends SessionProps {
  proposalId: number;
  ballotName: string;
}

export default function createBeginVotingAction({
  session,
  proposalId,
  ballotName,
}: CreateBeginVotingAction): Action<BeginVoting> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.BEGIN_VOTING,
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
