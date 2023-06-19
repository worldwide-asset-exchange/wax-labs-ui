import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { Profile } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateRemoveProfileAction {
  waxAccount?: string | null;
  activeUser: WaxUser;
}

export default function createRemoveProfileAction({
  waxAccount,
  activeUser: { accountName, requestPermission },
}: CreateRemoveProfileAction): Action<Profile> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_PROFILE,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      wax_account: waxAccount ?? accountName,
    },
  };
}
