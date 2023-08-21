import { Action, SessionProps } from '@/api/models';
import { Voter } from '@/api/models/voting.ts';
import { Actions, DECIDE_CONTRACT_ACCOUNT } from '@/constants.ts';

export type CreateSkipVotingAction = SessionProps;

export default function createVotingSyncAction({ session }: CreateSkipVotingAction): Action<Voter> {
  return {
    account: DECIDE_CONTRACT_ACCOUNT,
    name: Actions.SYNC,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      voter: session.actor.toString(),
    },
  };
}
