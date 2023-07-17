import { execute } from '@/api/chain/actions';
import createTransferFundsAction, {
  CreateTransferFundsAction,
} from '@/api/chain/transfers/actions/create/createTransferFundsAction.ts';

export async function transferFunds({ session }: CreateTransferFundsAction) {
  return await execute(session, [createTransferFundsAction({ session })]);
}
