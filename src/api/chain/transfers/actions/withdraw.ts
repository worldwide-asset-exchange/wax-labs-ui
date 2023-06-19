import { execute } from '@/api/chain/actions';
import createWithdrawAction, {
  CreateWithdrawAction,
} from '@/api/chain/transfers/actions/create/createWithdrawAction.ts';

export async function withdraw({ quantity, activeUser }: CreateWithdrawAction) {
  return await execute(activeUser, [createWithdrawAction({ quantity, activeUser })]);
}
