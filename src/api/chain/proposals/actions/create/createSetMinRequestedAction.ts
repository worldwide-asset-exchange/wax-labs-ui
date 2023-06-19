import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { MinRequested } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSetMinRequestedAction {
  minRequested: number;
  activeUser: WaxUser;
}

export default function createSetMinRequestedAction({
  minRequested,
  activeUser: { accountName, requestPermission },
}: CreateSetMinRequestedAction): Action<MinRequested> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_MIN_REQUESTED,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      new_min_requested: `${minRequested.toFixed(4)} USD`,
    },
  };
}
