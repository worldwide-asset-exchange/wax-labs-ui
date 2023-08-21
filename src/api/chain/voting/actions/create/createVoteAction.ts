import { Action, SessionProps } from '@/api/models';
import { Vote } from '@/api/models/voting.ts';
import { Actions, DECIDE_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateVoteAction extends SessionProps {
  ballotName: string;
  voteOption: string;
}

export default function createVoteAction({ session, ballotName, voteOption }: CreateVoteAction): Action<Vote> {
  return {
    account: DECIDE_CONTRACT_ACCOUNT,
    name: Actions.CAST_VOTE,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      voter: session.actor.toString(),
      options: [voteOption],
      ballot_name: ballotName,
    },
  };
}
