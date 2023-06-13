import createTransferFundsAction, { TransferFundsAction } from '@/api/chain/actions/create/transferFundsAction.ts';

import { execute } from './execute';

export async function transferFunds({ activeUser }: TransferFundsAction) {
  return await execute(activeUser, [createTransferFundsAction({ activeUser })]);
}
