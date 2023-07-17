import { Action, SessionProps } from '@/api/models';
import { VotingDuration } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetVotingDurationAction extends SessionProps {
  newVoteDuration: number;
}

export default function createSetVotingDurationAction({
  session,
  newVoteDuration,
}: CreateSetVotingDurationAction): Action<VotingDuration> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_VOTING_DURATION,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_vote_duration: newVoteDuration,
    },
  };
}
