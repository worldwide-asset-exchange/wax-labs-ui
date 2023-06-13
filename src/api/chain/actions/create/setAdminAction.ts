import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { SetAdmin } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface SetAdminAction {
  newAdmin: string;
  activeUser: WaxUser;
}

export default function createSetAdminAction({
  newAdmin,
  activeUser: { accountName, requestPermission },
}: SetAdminAction): Action<SetAdmin> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SET_ADMIN,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      new_admin: newAdmin,
    },
  };
}
