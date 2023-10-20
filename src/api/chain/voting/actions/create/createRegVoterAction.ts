import { Action, SessionProps } from '@/api/models';
import { RegVoter } from '@/api/models/voting.ts';
import { Actions, OIG_CODE } from '@/constants.ts';

export type CreateSkipVotingAction = SessionProps;

export default function createRegVoterAction({ session }: CreateSkipVotingAction): Action<RegVoter> {
  return {
    account: OIG_CODE,
    name: Actions.REG_VOTER,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      voter: session.actor.toString(),
      treasury_symbol: '8,VOTE',
    },
  };
}
