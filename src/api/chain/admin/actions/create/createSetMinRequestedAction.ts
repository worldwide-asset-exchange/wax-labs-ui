import { Action, SessionProps } from '@/api/models';
import { MinRequested } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetMinRequestedAction extends SessionProps {
  minRequested: number;
}

export default function createSetMinRequestedAction({
  minRequested,
  session,
}: CreateSetMinRequestedAction): Action<MinRequested> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_MIN_REQUESTED,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_min_requested: `${minRequested.toFixed(4)} USD`,
    },
  };
}
