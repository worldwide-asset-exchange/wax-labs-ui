import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { Withdraw } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT, TOKEN_SYMBOL } from '@/constants.ts';

export interface CreateWithdrawAction {
  quantity: number;
  activeUser: WaxUser;
}

export default function createWithdrawAction({
  quantity,
  activeUser: { accountName, requestPermission },
}: CreateWithdrawAction): Action<Withdraw> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.WITHDRAW,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      account_owner: accountName,
      quantity: `${quantity.toFixed(8)} ${TOKEN_SYMBOL}`,
    },
  };
}
