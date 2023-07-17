import { Action, SessionProps } from '@/api/models';
import { TransferFunds } from '@/api/models/actions.ts';
import { Actions, DRAFT_PROP_AMOUNT, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export type CreateTransferFundsAction = SessionProps;

export default function createTransferFundsAction({ session }: CreateTransferFundsAction): Action<TransferFunds> {
  const accountName = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.TRANSFER,
    authorization: [
      {
        actor: accountName,
        permission: session.permission.toString(),
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
