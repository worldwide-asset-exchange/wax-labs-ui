import { Action, SessionProps } from '@/api/models';
import { Withdraw } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT, TOKEN_SYMBOL } from '@/constants.ts';

export interface CreateWithdrawAction extends SessionProps {
  quantity: number;
}

export default function createWithdrawAction({ quantity, session }: CreateWithdrawAction): Action<Withdraw> {
  const accountName = session.actor.toString();

  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.WITHDRAW,
    authorization: [
      {
        actor: accountName,
        permission: session.permission.toString(),
      },
    ],
    data: {
      account_owner: accountName,
      quantity: `${quantity.toFixed(8)} ${TOKEN_SYMBOL}`,
    },
  };
}
