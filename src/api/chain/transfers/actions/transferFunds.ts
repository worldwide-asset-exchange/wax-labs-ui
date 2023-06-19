import { execute } from '@/api/chain/actions';
import createTransferFundsAction, {
  CreateTransferFundsAction,
} from '@/api/chain/transfers/actions/create/createTransferFundsAction.ts';

export async function transferFunds({ activeUser }: CreateTransferFundsAction) {
  return await execute(activeUser, [createTransferFundsAction({ activeUser })]);
}
