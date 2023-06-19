import createTransferFundsAction, {
  CreateTransferFundsAction,
} from '@/api/chain/actions/create/createTransferFundsAction.ts';

import { execute } from './execute';

export async function transferFunds({ activeUser }: CreateTransferFundsAction) {
  return await execute(activeUser, [createTransferFundsAction({ activeUser })]);
}
