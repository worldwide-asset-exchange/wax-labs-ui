import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { TransferFunds } from '@/api/models/actions';
import { Actions, DRAFT_PROP_AMOUNT, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateTransferFundsAction {
  activeUser: WaxUser;
}

export default function createTransferFundsAction({
  activeUser: { accountName, requestPermission },
}: CreateTransferFundsAction): Action<TransferFunds> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.TRANSFER,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      from: accountName,
      to: LABS_CONTRACT_ACCOUNT,
      quantity: DRAFT_PROP_AMOUNT,
      memo: '',
    },
  };
}
