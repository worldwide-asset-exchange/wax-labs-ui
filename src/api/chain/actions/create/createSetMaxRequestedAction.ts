import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { MaxRequested } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateSetMaxRequestedAction {
  maxRequested: number;
  activeUser: WaxUser;
}

export default function createSetMaxRequestedAction({
  maxRequested,
  activeUser: { accountName, requestPermission },
}: CreateSetMaxRequestedAction): Action<MaxRequested> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_MAX_REQUESTED,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      new_max_requested: `${maxRequested.toFixed(4)} USD`,
    },
  };
}
