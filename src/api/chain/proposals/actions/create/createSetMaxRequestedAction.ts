import { Action, SessionProps } from '@/api/models';
import { MaxRequested } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetMaxRequestedAction extends SessionProps {
  maxRequested: number;
}

export default function createSetMaxRequestedAction({
  maxRequested,
  session,
}: CreateSetMaxRequestedAction): Action<MaxRequested> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_MAX_REQUESTED,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      new_max_requested: `${maxRequested.toFixed(4)} USD`,
    },
  };
}
