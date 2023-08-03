import { Action, SessionProps } from '@/api/models';
import { TransferFunds } from '@/api/models/actions.ts';
import { Actions, DRAFT_PROP_AMOUNT, EOSIO_TOKEN_CODE, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export type CreateTransferFundsAction = SessionProps;

export default function createTransferFundsAction({ session }: CreateTransferFundsAction): Action<TransferFunds> {
  const actor = session.actor.toString();

  return {
    account: EOSIO_TOKEN_CODE,
    name: Actions.TRANSFER,
    authorization: [
      {
        actor,
        permission: session.permission.toString(),
      },
    ],
    data: {
      from: actor,
      to: LABS_CONTRACT_ACCOUNT,
      quantity: DRAFT_PROP_AMOUNT,
      memo: '',
    },
  };
}
